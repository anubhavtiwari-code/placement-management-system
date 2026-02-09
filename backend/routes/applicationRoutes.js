const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getMyApplications } = require("../controllers/applicationController");

router.get("/applications", auth(["student"]), getMyApplications);

module.exports = router;


