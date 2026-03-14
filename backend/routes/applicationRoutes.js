const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getMyApplications, getAllOpenDrives } = require("../controllers/applicationController");

router.get("/applications", auth(["student"]), getMyApplications);
router.get("/job_drives", auth(["student", "company"]), getAllOpenDrives);

module.exports = router;


