const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboard.controller");
const authenticate = require("../middleware/auth.middleware");

// Protect all dashboard routes
router.use(authenticate);

// Routes
router.get("/stats", getDashboardStats);

module.exports = router;