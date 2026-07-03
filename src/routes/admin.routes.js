const express = require("express");
const router = express.Router();
const { 
  getadminDashboard,
  getAllInvoices,
  updateInvoiceStatus,
  rejectInvoice
} = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Dashboard Stats Route
router.get("/stats", authMiddleware, getadminDashboard);

router.get("/invoices", authMiddleware, getAllInvoices);
router.patch("/approve/:id/status", authMiddleware, updateInvoiceStatus);
router.patch("/rejected/:id/status", rejectInvoice);  

module.exports = router;