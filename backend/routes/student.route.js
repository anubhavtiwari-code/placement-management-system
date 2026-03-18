const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const studentController = require("../controllers/student.controller");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage: storage });

router.post("/apply", auth(["student"]), studentController.applyJob);
router.get("/profile", auth(["student"]), studentController.getProfile);
router.put("/profile", auth(["student"]), upload.single("resume"), studentController.updateProfile);

module.exports = router;
