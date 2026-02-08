const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  const { email, password, role, cgpa } = req.body;

  if (!email || !password || !role || (role === "student" && !cgpa)) {
    return res.status(400).json({ message: "All fields required" });
  }

  // ✅ Explicit role validation (THIS IS THE KEY FIX)
  if (!["student", "company", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password, role, cgpa) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, role, cgpa ],
      (err, userResult) => {
        if (err) {
          console.error("REGISTER ERROR:", err);
          return res.status(400).json({ message: "User already exists" });
        }

        // 🔹 Auto-create ONLY for student & company
        if (role === "company") {
          db.query(
            "INSERT INTO companies (name, email) VALUES (?, ?)",
            ["Company Name", email]
          );
        }

        if (role === "student") {
          db.query(
            "INSERT INTO students (name, email, cgpa) VALUES (?, ?, ?)",
            ["Student Name", email, 0]
          );
        }

        // 🔹 Admin has NO profile table (by design)

        res.status(201).json({
          message: `${role} registered successfully`,
        });
      }
    );
  } catch (error) {
    console.error("REGISTER SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
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
