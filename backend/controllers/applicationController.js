const db = require("../config/db");

/**
 * GET /api/applications
 * Fetch logged-in student's applications
 */
exports.getMyApplications = (req, res) => {
  const userId = req.user.id; // users.id from JWT

  // 1️⃣ Find student using user_id
  db.query(
    "SELECT id FROM students WHERE user_id = ?",
    [userId],
    (err, studentResult) => {
      if (err) {
        console.error("Student lookup error:", err);
        return res.status(500).json({ message: "Student lookup failed" });
      }

      if (studentResult.length === 0) {
        // Student profile not created yet
        return res.status(200).json({ applications: [] });
      }

      const studentId = studentResult[0].id;

      // 2️⃣ Fetch applications with job + company
      const query = `
        SELECT
          a.id AS application_id,
          a.status,
          a.applied_at,
          j.job_title,
          c.company_name
        FROM applications a
        JOIN job_drives j ON a.job_drive_id = j.id
        JOIN companies c ON j.company_id = c.id
        WHERE a.student_id = ?
        ORDER BY a.applied_at DESC
      `;

      db.query(query, [studentId], (err, results) => {
        if (err) {
          console.error("Applications fetch error:", err);
          return res.status(500).json({ message: "Failed to load applications" });
        }

        return res.status(200).json({ applications: results });
      });
    }
  );
};
