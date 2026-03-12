const db = require("../config/db");

// 1️⃣ DASHBOARD STATS
exports.getStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM students) AS total_students,
      (SELECT COUNT(*) FROM companies) AS total_companies,
      (SELECT COUNT(*) FROM job_drives) AS total_job_drives,
      (SELECT COUNT(*) FROM applications) AS total_applications,
      (SELECT COUNT(*) FROM applications WHERE status = "Selected") AS total_selected_students
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Stats fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch statistics" });
    }
    res.json(results[0]);
  });
};

// 2️⃣ COMPANY VERIFICATION
exports.getCompanies = (req, res) => {
  // Return all companies with their verification status
  db.query("SELECT id, name, email, verification_status FROM companies", (err, results) => {
    if (err) {
      // If column doesn't exist yet, we'll handle it gracefully
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        return res.json([]);
      }
      return res.status(500).json({ message: "DB Error" });
    }
    res.json(results);
  });
};

exports.verifyCompany = (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "UPDATE companies SET verification_status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to update status" });
      res.json({ message: `Company ${status} successfully` });
    }
  );
};

// 3️⃣ DATA EXPORT (Placement Report)
exports.exportPlacementData = (req, res) => {
  const query = `
    SELECT 
      s.name AS student_name,
      s.email AS student_email,
      s.cgpa,
      c.name AS company_name,
      j.job_title,
      a.status,
      a.applied_at,
      a.interview_date
    FROM applications a
    JOIN students s ON a.student_id = s.id
    JOIN job_drives j ON a.job_drive_id = j.id
    JOIN companies c ON j.company_id = c.id
    ORDER BY a.applied_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Export failed" });
    res.json(results);
  });
};

// 4️⃣ BULK STUDENT ONBOARDING
exports.bulkOnboardStudents = async (req, res) => {
  const { students } = req.body; // Expecting array of {name, email, cgpa, user_id}

  if (!students || !Array.isArray(students)) {
    return res.status(400).json({ message: "Invalid student data format" });
  }

  // Note: In a real system, you'd also create entries in the 'users' table first.
  // For this simplification, we assume the user accounts exist or we just populate the student meta.
  
  const values = students.map(s => [s.name, s.email, s.cgpa || 0, s.user_id]);
  const query = "INSERT INTO students (name, email, cgpa, user_id) VALUES ?";

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error("Bulk insert error:", err);
      return res.status(500).json({ message: "Bulk import failed" });
    }
    res.json({ message: `${result.affectedRows} students imported successfully` });
  });
};
