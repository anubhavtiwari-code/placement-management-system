const db = require("../config/db");

/**
 * GET /api/applications
 * Fetch logged-in student's applications
 */
const sendAssignmentEmail = require("../utils/sendEmail");

exports.getMyApplications = (req, res) => {
  const userId = req.user.id; // users.id from JWT

  // 1️⃣ Find student using user_id
  db.query(
    "SELECT id FROM students WHERE user_id = ?",
    [userId],
    (err, studentRows) => {
      if (err) {
        console.error("Student lookup failed:", err);
        return res.status(500).json({ message: "Student lookup failed" });
      }

      if (studentRows.length === 0) {
        return res.status(200).json({ applications: [] });
      }

      const studentId = studentRows[0].id;

      // 2️⃣ Fetch applications with job title, company name, and job_drive_id
      const query = `
        SELECT
          a.id          AS application_id,
          a.job_drive_id,
          a.status,
          a.applied_at,
          a.interview_date,
          j.job_title,
          c.name        AS company_name
        FROM applications a
        JOIN job_drives j  ON a.job_drive_id  = j.id
        JOIN companies  c  ON j.company_id    = c.id
        WHERE a.student_id = ?
        ORDER BY a.applied_at DESC
      `;

      db.query(query, [studentId], (err, results) => {
        if (err) {
          console.error("Applications fetch failed:", err);
          return res.status(500).json({ message: "Applications fetch failed" });
        }

        return res.status(200).json({ applications: results });
      });
    }
  );
};
