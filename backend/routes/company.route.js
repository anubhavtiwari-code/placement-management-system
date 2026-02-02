const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const db = require("../config/db");

// ===============================
// CREATE JOB DRIVE (FAST FIX)
// ===============================
router.post("/job", auth(["company"]), (req, res) => {
  const { job_title, min_cgpa, drive_date, description } = req.body;

  if (!job_title || !min_cgpa || !drive_date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  // 🔑 STEP 1: Get company using email from JWT
  const companyEmail = req.user.email;

  db.query(
    "SELECT id FROM companies WHERE email = ?",
    [companyEmail],
    (err, result) => {
      if (err) {
        console.error("Company lookup error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(400).json({
          message: "Company record not found. Please contact admin.",
        });
      }

      const company_id = result[0].id;

      // 🔑 STEP 2: Insert job drive using valid company_id
      const insertQuery = `
        INSERT INTO job_drives
        (company_id, job_title, description, min_cgpa, drive_date)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [
          company_id,
          job_title,
          description || "",
          min_cgpa,
          drive_date,
        ],
        (err) => {
          if (err) {
            console.error("Job insert error:", err);
            return res.status(500).json({ message: "Failed to create job drive" });
          }

          res.status(201).json({
            message: "Job drive created successfully",
          });
        }
      );
    }
  );
});

module.exports = router;
