const db = require("../config/db");

// CREATE JOB
exports.createJobDrive = (req, res) => {
  const { job_title, min_cgpa, description } = req.body;
  const companyUserId = req.user.id;

  db.query(
    "SELECT id FROM Companies WHERE user_id = ?",
    [companyUserId],
    (err, companyRows) => {
      if (err || companyRows.length === 0) {
        return res.status(400).json({ message: "Company not found" });
      }

      const company_id = companyRows[0].id;

      if (!job_title || !min_cgpa || !description) {
        return res.status(400).json({ message: "Required fields missing" });
      }

  // db.query(
  //   "SELECT id FROM companies WHERE email = ?",
  //   [companyEmail],
  //   (err, companyResult) => {
  //     if (err || companyResult.length === 0) {
  //       return res.status(400).json({ message: "Company not found" });
  //     }

  //     const company_id = companyResult[0].id;

      db.query(
        `INSERT INTO job_drives 
         (company_id, job_title, description, min_cgpa, drive_date)
         VALUES (?, ?, ?, ?, ?)`,
        [company_id, job_title, description || "", min_cgpa, drive_date],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Failed to create job" });
          }
          res.status(201).json({ message: "Job drive created successfully" });
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
