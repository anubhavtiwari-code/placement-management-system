const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  const { email, password, role, name, cgpa } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields (email, password, role)" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // 1️⃣ Insert into users
  db.query(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, role],
    (err, userResult) => {
      if (err) {
        return res.status(500).json({ message: "User registration failed" });
      }

      const userId = userResult.insertId;

      // 2️⃣ Create role-specific profile
      if (role === "student") {
        // Use INSERT ... ON DUPLICATE KEY UPDATE to handle partial legacy data
        db.query(
          "INSERT INTO students (name, email, cgpa, user_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), name = VALUES(name)",
          [name || "Student", email, cgpa || 0, userId],
          (err) => {
            if (err) {
              console.error("Student profile creation error:", err);
              return res.status(500).json({ message: "Profile creation failed. Please contact admin." });
            }
            return res.status(201).json({ message: "Student registered successfully" });
          }
        );
      } else if (role === "company") {
        db.query(
          "INSERT INTO companies (name, email) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
          [name || "Company", email],
          (err) => {
            if (err) {
              console.error("Company profile creation error:", err);
              return res.status(500).json({ message: "Company profile creation failed." });
            }
            return res.status(201).json({ message: "Company registered successfully" });
          }
        );
      } else {
        return res.status(201).json({ message: "Admin registered successfully" });
      }
    }
  );
};


/* ================= LOGIN ================= */
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("LOGIN DB ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        role: user.role,
      });
    }
  );
};
