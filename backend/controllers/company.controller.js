const db = require("../config/db");

// CREATE JOB
exports.createJob = (req, res) => {
  const { job_title, min_cgpa, description } = req.body;
  const userId = req.user.id; // this is users.id

  if (!job_title || !min_cgpa) {
    return res.status(400).json({ message: "All fields required" });
  }

  // STEP 1: Find company using user_id
  db.query(
    "SELECT id FROM companies WHERE email = ?",
    [req.user.email],  // since your companies table has email column
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "Company not found" });
      }

      const company_id = result[0].id;

      // STEP 2: Insert job drive
      db.query(
        "INSERT INTO job_drives (job_title, min_cgpa, description, company_id) VALUES (?, ?, ?, ?)",
        [job_title, min_cgpa, description, company_id],
        (err) => {
          if (err) {
            console.error("Insert error:", err);
            return res.status(500).json({ message: "Failed to create job" });
          }

          res.status(201).json({ message: "Job created successfully" });
        }
      );
    }
  );
};


// VIEW APPLICANTS
exports.viewApplicants = (req, res) => {
  const companyEmail = req.user.email;

  db.query(
    "SELECT id FROM companies WHERE email = ?",
    [companyEmail],
    (err, companyResult) => {
      if (err || companyResult.length === 0) {
        return res.status(400).json({ message: "Company not found" });
      }

      const company_id = companyResult[0].id;

      const query = `
        SELECT
          students.name AS student_name,
          students.email AS student_email,
          job_drives.job_title,
          applications.status,
          applications.applied_at
        FROM applications
        JOIN students ON applications.student_id = students.id
        JOIN job_drives ON applications.job_drive_id = job_drives.id
        WHERE job_drives.company_id = ?
      `;

      db.query(query, [company_id], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.json({
          count: results.length,
          applicants: results,
        });
      });
    }
  );
};
