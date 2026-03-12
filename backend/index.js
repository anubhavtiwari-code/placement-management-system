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
// Version-safe migration for verification_status
db.query("SHOW COLUMNS FROM companies LIKE 'verification_status'", (err, rows) => {
  if (err) return console.error("Migration check error:", err.message);
  if (rows.length === 0) {
    db.query(`
      ALTER TABLE companies 
      ADD COLUMN verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
    `, (err) => {
      if (err) console.error("Migration execution error:", err.message);
      else console.log("Database Migration: Added verification_status to companies table.");
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
