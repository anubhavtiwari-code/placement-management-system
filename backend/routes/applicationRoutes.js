const express = require("express");
const router = express.Router();
const { getMyApplications } = require("../controllers/applicationController");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/applications", authMiddleware, getMyApplications);

module.exports = router;
