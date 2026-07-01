const express = require("express");
const router = express.Router();

// ⚠️ Yahan check karo: Imports exact matching hone chahiye controller ke exports se
const { getProfile, saveProfile, clearProfile } = require("../controllers/companyController");

router.get("/company-profile", getProfile);
router.post("/company-profile", saveProfile);
router.delete("/company-profile", clearProfile);

module.exports = router;