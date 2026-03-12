const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const c = require("../controllers/company.controller");

// ── Job Drive CRUD ──────────────────────────────────────────────────────────
router.get("/job_drives",           auth(["company"]), c.getMyDrives);
router.post("/job_drives",          auth(["company"]), c.createJob);
router.put("/job_drives/:id",       auth(["company"]), c.editJob);
router.delete("/job_drives/:id",    auth(["company"]), c.deleteJob);
router.patch("/job_drives/:id/status", auth(["company"]), c.toggleStatus);

// ── Applicants ───────────────────────────────────────────────────────────────
router.get("/applicants",                    auth(["company"]), c.viewApplicants);
router.patch("/applications/batch-status",   auth(["company"]), c.batchUpdateStatus); // New: Batch update
router.patch("/applications/:id/status",     auth(["company"]), c.updateApplicantStatus);
router.patch("/applications/:id/schedule",   auth(["company"]), c.scheduleInterview); // New: Scheduler

module.exports = router;
