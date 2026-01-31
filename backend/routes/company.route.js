const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const db = require("../config/db");

// Create job drive
router.post("/job", auth(["company"]), (req, res) => {
  const { job_title, min_cgpa, drive_date } = req.body;
  const company_id = req.user.id;

  const query = `
    INSERT INTO job_drives (company_id, job_title, min_cgpa, drive_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [company_id, job_title, min_cgpa, drive_date], (err) => {
    if (err) return res.status(500).json({ message: "Job creation failed" });
    res.json({ message: "Job drive created" });
  });
});

// View applicants
router.get("/applicants", auth(["company"]), (req, res) => {
  const query = `
    SELECT students.name, applications.status
    FROM applications
    JOIN students ON applications.student_id = students.id
    JOIN job_drives ON applications.job_drive_id = job_drives.id
    WHERE job_drives.company_id = ?
  `;

  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(results);
  });
});

module.exports = router;
