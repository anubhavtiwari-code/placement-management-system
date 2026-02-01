const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  console.log("REGISTER BODY 👉", req.body);
  // 1. Validation
  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["student", "company"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // 2. Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 3. Insert user
  const query = `
    INSERT INTO users (email, password, role)
    VALUES (?, ?, ?)
  `;

  db.query(query, [email, hashedPassword, role], (err) => {
    if (err) {
      console.error("REGISTER ERROR:", err);
      return res.status(500).json({
        message: "User already exists or database error",
      });
    }

    res.status(201).json({
      message: "User registered successfully",
    });
  });
};
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], (err, results) => {
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
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  });
};

