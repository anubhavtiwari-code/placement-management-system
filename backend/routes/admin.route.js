const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const db = require("../config/db");

// Dashboard stats
router.get("/stats", auth(["admin"]), (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM students) total_students,
      (SELECT COUNT(*) FROM companies) total_companies,
      (SELECT COUNT(*) FROM job_drives) total_jobs,
      (SELECT COUNT(*) FROM applications) total_applications
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(result[0]);
  });
});

module.exports = router;
