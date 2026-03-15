const db = require("../config/db");

exports.applyJob = (req, res) => {
  const { job_drive_id } = req.body;
  const studentEmail = req.user.email;

  if (!job_drive_id) {
    return res.status(400).json({ message: "Job drive ID required" });
  }

  // 1️⃣ Get student id (Prioritize user_id link + Case Insensitive email)
  const userId = req.user.id;
  console.log(`[DEBUG] Apply Request from: ${studentEmail} (job: ${job_drive_id})`);
  
  db.query(
    "SELECT id FROM students WHERE user_id = ? OR LOWER(email) = LOWER(?)",
    [userId, studentEmail],
    (err, studentResult) => {
      if (err || studentResult.length === 0) {
        console.error(`[ERROR] Apply failed: No student found for ${studentEmail}`);
        return res.status(400).json({ message: "Student profile not found" });
      }

      const student_id = studentResult[0].id;

      // 2️⃣ Check if already applied to this job
      db.query(
        "SELECT id FROM applications WHERE student_id = ? AND job_drive_id = ?",
        [student_id, job_drive_id],
        (err, existingApp) => {
          if (err) {
            return res.status(500).json({ message: "DB error" });
          }

          if (existingApp.length > 0) {
            return res.status(409).json({
              message: "Already applied to this job",
            });
          }

          // 3️⃣ Insert new application
          db.query(
            "INSERT INTO applications (student_id, job_drive_id, status) VALUES (?, ?, 'Applied')",
            [student_id, job_drive_id],
            (err, result) => {
              if (err) {
                return res.status(500).json({ message: "Failed to apply" });
              }

              // 4️⃣ Return application id
              res.status(201).json({
                message: "Applied to job successfully",
                application_id: result.insertId,
              });
            }
          );
        }
      );
    }
  );
};
exports.getProfile = (req, res) => {
  const userId = req.user.id;
  const email = req.user.email;

  console.log(`[DEBUG] Profile Request: ${email}`);

  // Try user_id first, then fallback to email (Case Insensitive)
  const query = "SELECT name, email, cgpa FROM students WHERE user_id = ? OR LOWER(email) = LOWER(?)";
  db.query(query, [userId, email], (err, results) => {
    if (err) {
      console.error("Profile fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch profile" });
    }

    if (results.length === 0) {
      console.warn(`[WARN] Profile not found in students table for: ${email}`);
      return res.status(404).json({ message: "Student profile not found. Please re-register or contact admin." });
    }

    return res.status(200).json({ 
      success: true,
      profile: results[0] 
    });
  });
};
