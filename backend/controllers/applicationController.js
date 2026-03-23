const db = require("../config/db");

/**
 * GET /api/applications
 * Fetch logged-in student's applications
 */
const sendAssignmentEmail = require("../utils/sendEmail");

exports.getMyApplications = (req, res) => {
  const userId = req.user.id;
  const email = req.user.email;

  const findOrCreateStudent = (cb) => {
    db.query(
      "SELECT id FROM students WHERE user_id = ? OR LOWER(email) = LOWER(?)",
      [userId, email],
      (err, results) => {
        if (err) return cb(err);
        if (results.length > 0) return cb(null, results[0].id);

        // Auto-Provision
        db.query(
          "INSERT INTO students (name, email, user_id) VALUES (?, ?, ?)",
          ["Student", email, userId],
          (err, insertRes) => {
            if (err) return cb(err);
            cb(null, insertRes.insertId);
          }
        );
      }
    );
  };

  findOrCreateStudent((err, studentId) => {
    if (err) return res.status(200).json({ success: true, applications: [] });

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
/**
 * GET /api/job_drives
 * Fetch all open job drives for students
 */
const { calculateMatchScore } = require('../utils/matchEngine');

exports.getAllOpenDrives = (req, res) => {
  const query = `
    SELECT 
      j.id, 
      j.job_title, 
      j.min_cgpa, 
      j.description, 
      j.drive_date, 
      c.name AS company_name 
    FROM job_drives j
    JOIN companies c ON j.company_id = c.id
    WHERE j.status = 'open'
    ORDER BY j.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Fetch job drives failed:", err);
      return res.status(500).json({ message: "Failed to fetch job drives" });
    }

    // If student, calculate match score
    if (req.user && req.user.role === 'student') {
      db.query("SELECT skills FROM students WHERE user_id = ? OR LOWER(email) = LOWER(?)", [req.user.id, req.user.email], (err, studentRes) => {
        if (!err && studentRes.length > 0) {
          const studentSkills = studentRes[0].skills || "";
          const jobsWithScores = results.map(job => ({
            ...job,
            match_score: calculateMatchScore(studentSkills, job.job_title + " " + (job.description || ""))
          }));
          return res.status(200).json({ job_drives: jobsWithScores });
        } else {
          res.status(200).json({ job_drives: results });
        }
      });
    } else {
      res.status(200).json({ job_drives: results });
    }
  });
};
