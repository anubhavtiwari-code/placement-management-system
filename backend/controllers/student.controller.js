const db = require("../config/db");

exports.applyJob = (req, res) => {
  const { job_drive_id } = req.body;
  const studentEmail = req.user.email;

  if (!job_drive_id) {
    return res.status(400).json({ message: "Job drive ID required" });
  }

  db.query(
    "SELECT id FROM students WHERE email = ?",
    [studentEmail],
    (err, studentResult) => {
      if (err || studentResult.length === 0) {
        return res.status(400).json({ message: "Student profile not found" });
      }

      const student_id = studentResult[0].id;

      db.query(
        "INSERT INTO applications (student_id, job_drive_id) VALUES (?, ?)",
        [student_id, job_drive_id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Failed to apply" });
          }

          res.status(201).json({
            message: "Applied to job successfully",
          });
        }
      );
    }
  );
};
