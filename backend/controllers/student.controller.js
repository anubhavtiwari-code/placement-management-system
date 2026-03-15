const db = require("../config/db");

exports.applyJob = (req, res) => {
  const { job_drive_id } = req.body;
  const studentEmail = req.user.email;

  if (!job_drive_id) {
    return res.status(400).json({ message: "Job drive ID required" });
  }

  // 1️⃣ Get student id (With Auto-Provisioning fallback)
  const userId = req.user.id;
  
  const findOrCreateStudent = (cb) => {
    db.query(
      "SELECT id FROM students WHERE user_id = ? OR LOWER(email) = LOWER(?)",
      [userId, studentEmail],
      (err, results) => {
        if (err) return cb(err);
        if (results.length > 0) return cb(null, results[0].id);

        // Profile missing? Try to auto-create from user table
        console.log(`[REPAIR] Auto-provisioning profile for: ${studentEmail}`);
        db.query(
          "INSERT INTO students (name, email, user_id) VALUES (?, ?, ?)",
          [req.user.name || "Student", studentEmail, userId],
          (err, insertRes) => {
            if (err) return cb(err);
            cb(null, insertRes.insertId);
          }
        );
      }
    );
  };

  findOrCreateStudent((err, student_id) => {
    if (err) {
      console.error(`[ERROR] Student lookup/provision failed for ${studentEmail}:`, err);
      return res.status(400).json({ message: "Student profile not found" });
    }

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

  // Use a reusable query to find or link
  const query = "SELECT name, email, cgpa FROM students WHERE user_id = ? OR LOWER(email) = LOWER(?)";
  db.query(query, [userId, email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });

    if (results.length > 0) {
      return res.status(200).json({ success: true, profile: results[0] });
    }

    // Attempt repair: Create if user exists
    db.query(
      "INSERT INTO students (name, email, user_id) VALUES (?, ?, ?)",
      ["Student", email, userId],
      (err) => {
        if (err) return res.status(404).json({ message: "Profile creation failed" });
        return res.status(200).json({ 
          success: true, 
          profile: { name: "Student", email: email, cgpa: 0 } 
        });
      }
    );
  });
};
