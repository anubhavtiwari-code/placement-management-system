const db = require("../config/db");

// ─── Helper: get company_id from logged-in user email ──────────────────────
const getCompanyId = (email, cb) => {
  db.query("SELECT id FROM companies WHERE email = ?", [email], (err, rows) => {
    if (err) return cb(err);
    if (rows.length === 0) return cb(new Error("Company not found"));
    cb(null, rows[0].id);
  });
};

// ─── CREATE JOB DRIVE ──────────────────────────────────────────────────────
exports.createJob = (req, res) => {
  const { job_title, min_cgpa, description, drive_date } = req.body;

  if (!job_title || !min_cgpa) {
    return res.status(400).json({ message: "Job title and min CGPA are required" });
  }

  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    db.query(
      "INSERT INTO job_drives (job_title, min_cgpa, description, company_id, drive_date, status) VALUES (?, ?, ?, ?, ?, 'open')",
      [job_title, min_cgpa, description || null, company_id, drive_date || null],
      (err) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ message: "Failed to create job" });
        }
        res.status(201).json({ message: "Job created successfully" });
      }
    );
  });
};

// ─── GET MY DRIVES (with applicant count per drive) ────────────────────────
exports.getMyDrives = (req, res) => {
  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    const query = `
      SELECT
        j.id,
        j.job_title,
        j.min_cgpa,
        j.description,
        j.drive_date,
        j.status,
        COUNT(a.id) AS applicant_count
      FROM job_drives j
      LEFT JOIN applications a ON a.job_drive_id = j.id
      WHERE j.company_id = ?
      GROUP BY j.id
      ORDER BY j.id DESC
    `;

    db.query(query, [company_id], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ drives: results });
    });
  });
};

// ─── EDIT JOB DRIVE ────────────────────────────────────────────────────────
exports.editJob = (req, res) => {
  const { id } = req.params;
  const { job_title, min_cgpa, description, drive_date } = req.body;

  if (!job_title || !min_cgpa) {
    return res.status(400).json({ message: "Job title and min CGPA are required" });
  }

  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    db.query(
      "UPDATE job_drives SET job_title = ?, min_cgpa = ?, description = ?, drive_date = ? WHERE id = ? AND company_id = ?",
      [job_title, min_cgpa, description || null, drive_date || null, id, company_id],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Drive not found or not yours" });
        res.json({ message: "Job updated successfully" });
      }
    );
  });
};

// ─── DELETE JOB DRIVE ──────────────────────────────────────────────────────
exports.deleteJob = (req, res) => {
  const { id } = req.params;

  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    // Delete applications first (FK constraint)
    db.query(
      "DELETE FROM applications WHERE job_drive_id = ? AND job_drive_id IN (SELECT id FROM (SELECT id FROM job_drives WHERE company_id = ?) AS sub)",
      [id, company_id],
      (err) => {
        if (err) {
          console.error("Cascade delete error:", err);
          return res.status(500).json({ message: "Failed to delete related applications" });
        }

        db.query(
          "DELETE FROM job_drives WHERE id = ? AND company_id = ?",
          [id, company_id],
          (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (result.affectedRows === 0)
              return res.status(404).json({ message: "Drive not found or not yours" });
            res.json({ message: "Job drive deleted successfully" });
          }
        );
      }
    );
  });
};

// ─── TOGGLE DRIVE STATUS (open ↔ closed) ──────────────────────────────────
exports.toggleStatus = (req, res) => {
  const { id } = req.params;

  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    db.query(
      "SELECT status FROM job_drives WHERE id = ? AND company_id = ?",
      [id, company_id],
      (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (rows.length === 0)
          return res.status(404).json({ message: "Drive not found or not yours" });

        const newStatus = rows[0].status === "open" ? "closed" : "open";

        db.query(
          "UPDATE job_drives SET status = ? WHERE id = ? AND company_id = ?",
          [newStatus, id, company_id],
          (err) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json({ message: `Drive is now ${newStatus}`, status: newStatus });
          }
        );
      }
    );
  });
};

// ─── VIEW ALL APPLICANTS (with application id for status updates) ──────────
exports.viewApplicants = (req, res) => {
  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    const query = `
      SELECT
        applications.id AS application_id,
        students.name   AS student_name,
        students.email  AS student_email,
        students.cgpa   AS student_cgpa,
        job_drives.job_title,
        job_drives.id   AS job_drive_id,
        applications.status,
        applications.applied_at,
        applications.interview_date
      FROM applications
      JOIN students   ON applications.student_id   = students.id
      JOIN job_drives ON applications.job_drive_id = job_drives.id
      WHERE job_drives.company_id = ?
      ORDER BY applications.applied_at DESC
    `;

    db.query(query, [company_id], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ count: results.length, applicants: results });
    });
  });
};

// ── UPDATE APPLICANT STATUS ───────────────────────────────────────────────
exports.updateApplicantStatus = (req, res) => {
  const { id } = req.params; // application id
  const { status } = req.body;

  const allowed = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    // Ownership check: application must belong to this company's drive
    const query = `
      UPDATE applications a
      JOIN job_drives j ON a.job_drive_id = j.id
      SET a.status = ?
      WHERE a.id = ? AND j.company_id = ?
    `;

    db.query(query, [status, id, company_id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Application not found or access denied" });
      res.json({ message: "Status updated successfully", status });
    });
  });
};

// ── BATCH UPDATE APPLICANT STATUS ──────────────────────────────────────────
exports.batchUpdateStatus = (req, res) => {
  const { ids, status } = req.body; // ids is an array of application IDs

  const allowed = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "An array of application IDs is required" });
  }
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    const query = `
      UPDATE applications a
      JOIN job_drives j ON a.job_drive_id = j.id
      SET a.status = ?
      WHERE a.id IN (?) AND j.company_id = ?
    `;

    db.query(query, [status, ids, company_id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ 
        message: `${result.affectedRows} applications updated successfully`, 
        status,
        count: result.affectedRows 
      });
    });
  });
};

// ── SCHEDULE INTERVIEW ─────────────────────────────────────────────────────
exports.scheduleInterview = (req, res) => {
  const { id } = req.params; // application id
  const { interview_date } = req.body; // e.g., '2023-10-15 14:00:00'

  if (!interview_date) {
    return res.status(400).json({ message: "Interview date/time is required" });
  }

  getCompanyId(req.user.email, (err, company_id) => {
    if (err) return res.status(400).json({ message: err.message });

    const query = `
      UPDATE applications a
      JOIN job_drives j ON a.job_drive_id = j.id
      SET a.interview_date = ?, a.status = 'Interview'
      WHERE a.id = ? AND j.company_id = ?
    `;

    db.query(query, [interview_date, id, company_id], (err, result) => {
      if (err) {
        if (err.code === "ER_BAD_FIELD_ERROR") {
          return res.status(400).json({ 
            message: "Database schema lacks 'interview_date' column in 'applications' table." 
          });
        }
        return res.status(500).json({ message: "Database error" });
      }
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Application not found or access denied" });
      
      res.json({ message: "Interview scheduled and status updated", interview_date });
    });
  });
};
