require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");
const auth = require("./middleware/auth.middleware");

// =======================
// MIDDLEWARE
// =======================
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// =======================
// ROUTES (JWT SYSTEM)
// =======================

// AUTH ROUTES
app.use("/api/auth",    require("./routes/auth.route"));

// CORE MODULE ROUTES
app.use("/api/admin",   require("./routes/admin.route")); 
app.use("/api/company", require("./routes/company.route"));
app.use("/api/student", require("./routes/student.route"));
app.use("/api",         require("./routes/applicationRoutes"));

// =======================
// DB INITIALIZATION (MIGRATIONS)
// =======================

// ==========================================
// DB INITIALIZATION (MIGRATIONS & SCHEMA)
// ==========================================
const initDB = async () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'company', 'admin') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      cgpa DECIMAL(3,2) DEFAULT 0.0,
      user_id INT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS companies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
    )`,
    `CREATE TABLE IF NOT EXISTS job_drives (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company_id INT NOT NULL,
      job_title VARCHAR(255) NOT NULL,
      description TEXT,
      min_cgpa DECIMAL(3,2) DEFAULT 0.0,
      drive_date DATE,
      status ENUM('open', 'closed') DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      job_drive_id INT NOT NULL,
      status ENUM('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected') DEFAULT 'Applied',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      interview_date DATETIME DEFAULT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (job_drive_id) REFERENCES job_drives(id) ON DELETE CASCADE
    )`
  ];

  for (const sql of tables) {
    try {
      await db.promise().query(sql);
    } catch (err) {
      console.error("Migration Error:", err.message);
    }
  }

  // Column Migrations (for existing tables)
  const migrations = [
    { table: 'companies', col: 'verification_status', sql: "ALTER TABLE companies ADD COLUMN verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'" },
    { table: 'applications', col: 'interview_date', sql: "ALTER TABLE applications ADD COLUMN interview_date DATETIME DEFAULT NULL" },
    { table: 'job_drives', col: 'status', sql: "ALTER TABLE job_drives ADD COLUMN status ENUM('open', 'closed') DEFAULT 'open'" },
    { table: 'students', col: 'user_id', sql: "ALTER TABLE students ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" }
  ];

  for (const m of migrations) {
    db.query(`SHOW COLUMNS FROM ${m.table} LIKE '${m.col}'`, (err, rows) => {
      if (!err && rows.length === 0) {
        db.query(m.sql, (err2) => {
          if (!err2) console.log(`Migration: Added ${m.col} to ${m.table}`);
        });
      }
    });
  }
  
  console.log("✅ Database Schema Integrity Verified");
};

initDB();

// =======================
// BASIC TEST ROUTES
// =======================
app.get("/", (req, res) => {
  res.send("NexusPlace Backend is running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working fine", status: "success" });
});

// =======================
// ERROR HANDLING
// =======================
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server launched on port ${PORT}`);
});
