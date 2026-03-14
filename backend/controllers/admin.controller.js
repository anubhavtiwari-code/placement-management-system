/**
 * @fileoverview Admin Controller for managing platform-wide statistics, company verification,
 * data export, and bulk student onboarding.
 */

const db = require("../config/db");

/**
 * 1️⃣ FETCH DASHBOARD STATISTICS
 * Retrieves counts for students, companies, job drives, and applications.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.getStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM students) AS total_students,
      (SELECT COUNT(*) FROM companies) AS total_companies,
      (SELECT COUNT(*) FROM job_drives) AS total_job_drives,
      (SELECT COUNT(*) FROM applications) AS total_applications,
      (SELECT COUNT(*) FROM applications WHERE status = 'Selected') AS total_selected_students
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("[AdminController] Stats fetch error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch platform statistics" 
      });
    }
    res.json(results[0]);
  });
};

/**
 * 2️⃣ GET ALL COMPANIES
 * Returns a list of all registered companies and their verification status.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.getCompanies = (req, res) => {
  db.query("SELECT id, name, email, verification_status FROM companies", (err, results) => {
    if (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        console.warn("[AdminController] verification_status column missing, returning empty array");
        return res.json([]);
      }
      return res.status(500).json({ success: false, message: "Internal Database Error" });
    }
    res.json(results);
  });
};

/**
 * 3️⃣ VERIFY/UPDATE COMPANY STATUS
 * Approves or rejects a company registration.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.verifyCompany = (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid verification status provided" });
  }

  db.query(
    "UPDATE companies SET verification_status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.error("[AdminController] Verify error:", err);
        return res.status(500).json({ success: false, message: "Failed to update company status" });
      }
      res.json({ success: true, message: `Company successfully ${status}` });
    }
  );
};

/**
 * 4️⃣ EXPORT PLACEMENT DATA
 * Generates a comprehensive report of student applications and statuses.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
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
    if (err) {
      console.error("[AdminController] Export error:", err);
      return res.status(500).json({ success: false, message: "Failed to generate placement report" });
    }
    res.json(results);
  });
};

/**
 * 5️⃣ BULK STUDENT ONBOARDING
 * Efficiently imports multiple student records in a single transaction.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.bulkOnboardStudents = async (req, res) => {
  const { students } = req.body; 

  if (!students || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid or empty student data provided" });
  }

  const values = students.map(s => [s.name, s.email, s.cgpa || 0, s.user_id]);
  const query = "INSERT INTO students (name, email, cgpa, user_id) VALUES ?";

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error("[AdminController] Bulk import error:", err);
      return res.status(500).json({ success: false, message: "Bulk student import failed" });
    }
    res.json({ 
      success: true, 
      message: `${result.affectedRows} student records synchronized successfully` 
    });
  });
};

