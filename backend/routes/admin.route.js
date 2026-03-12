const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ad = require("../controllers/admin.controller");

// Stats
router.get("/stats",            auth(["admin"]), ad.getStats);

// Company Management
router.get("/companies",         auth(["admin"]), ad.getCompanies);
router.patch("/companies/:id",   auth(["admin"]), ad.verifyCompany);

// Reports
router.get("/export-data",       auth(["admin"]), ad.exportPlacementData);

// Bulk Actions
router.post("/bulk-students",    auth(["admin"]), ad.bulkOnboardStudents);

module.exports = router;
