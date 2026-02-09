const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach user to request
      req.user = decoded;

      // role check (if roles provided)
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    
      next(); // ✅ VERY IMPORTANT
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};


