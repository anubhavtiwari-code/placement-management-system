const db = require("../config/db");

exports.getMyApplications = (req, res) => {
  const studentEmail = req.user.email;

  // 1️⃣ Get student ID
  db.query(
    "SELECT id FROM students WHERE email = ?",
    [studentEmail],
    (err, studentResult) => {
      if (err || studentResult.length === 0) {
        return res.status(400).json({ message: "Student not found" });
      }

      const student_id = studentResult[0].id;

      // 2️⃣ Get applications with job details
      const query = `
        SELECT 
          a.id AS application_id,
          a.job_drive_id,
          a.status,
          a.applied_at,
          j.job_title,
          j.company_name
        FROM applications a
        JOIN job_drives j ON a.job_drive_id = j.id
        WHERE a.student_id = ?
        ORDER BY a.applied_at DESC
      `;

      db.query(query, [student_id], (err, applications) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Failed to fetch applications" });
        }

        res.status(200).json({
          applications,
        });
      });
    }
  );
};
