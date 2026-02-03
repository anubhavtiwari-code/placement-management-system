const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const companyController = require("../controllers/company.controller");

router.post("/job", auth(["company"]), companyController.createJob);
router.get("/applicants", auth(["company"]), companyController.viewApplicants);

module.exports = router;
