const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const studentController = require("../controllers/student.controller");

router.post("/apply", auth(["student"]), studentController.applyJob);
router.get("/profile", auth(["student"]), studentController.getProfile);

module.exports = router;
