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

// 1. Verification Status in Companies
db.query("SHOW COLUMNS FROM companies LIKE 'verification_status'", (err, rows) => {
  if (err) return console.error("Migration error (companies):", err.message);
  if (rows.length === 0) {
    db.query("ALTER TABLE companies ADD COLUMN verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'", (err) => {
      if (!err) console.log("Migration: Added verification_status to companies.");
    });
  }
});

// 2. Interview Date in Applications
db.query("SHOW COLUMNS FROM applications LIKE 'interview_date'", (err, rows) => {
  if (err) return console.error("Migration error (applications):", err.message);
  if (rows.length === 0) {
    db.query("ALTER TABLE applications ADD COLUMN interview_date DATETIME DEFAULT NULL", (err) => {
      if (!err) console.log("Migration: Added interview_date to applications.");
    });
  }
});

// 3. Status in Job Drives
db.query("SHOW COLUMNS FROM job_drives LIKE 'status'", (err, rows) => {
  if (err) return console.error("Migration error (job_drives):", err.message);
  if (rows.length === 0) {
    db.query("ALTER TABLE job_drives ADD COLUMN status ENUM('open', 'closed') DEFAULT 'open'", (err) => {
      if (!err) console.log("Migration: Added status to job_drives.");
    });
  }
});

// 4. User ID in Students (for JWT mapping)
db.query("SHOW COLUMNS FROM students LIKE 'user_id'", (err, rows) => {
  if (err) return console.error("Migration error (students):", err.message);
  if (rows.length === 0) {
    db.query("ALTER TABLE students ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE", (err) => {
      if (!err) console.log("Migration: Added user_id to students.");
    });
  }
});

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
