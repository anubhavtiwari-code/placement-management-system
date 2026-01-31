const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const db = require("../config/db");

// Student applies to job
router.post("/apply", auth(["student"]), (req, res) => {
  const { job_drive_id } = req.body;
  const student_id = req.user.id;

  const query = `
    INSERT INTO applications (student_id, job_drive_id)
    VALUES (?, ?)
  `;

  db.query(query, [student_id, job_drive_id], (err) => {
    if (err) return res.status(500).json({ message: "Apply failed" });
    res.json({ message: "Applied successfully" });
  });
});

// Student views own applications
router.get("/applications", auth(["student"]), (req, res) => {
  const query = `
    SELECT job_drives.job_title, applications.status
    FROM applications
    JOIN job_drives ON applications.job_drive_id = job_drives.id
    WHERE applications.student_id = ?
  `;

  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(results);
  });
});

module.exports = router;
