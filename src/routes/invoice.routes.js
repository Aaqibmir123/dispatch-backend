const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getInvoiceList,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus
} = require("../controllers/invoice.controller");

const authenticate = require("../middleware/auth.middleware"); // ✅ FIX HERE

// Protect all invoice routes
router.use(authenticate);

// Routes
router.post("/", createInvoice);
router.get("/", getInvoiceList);
router.get("/:invoiceId", getInvoiceById);
router.put("/:invoiceId", updateInvoice);
router.delete("/:invoiceId", deleteInvoice);
// Status changer micro-route patch binding
router.patch("/:invoiceId/status", updateInvoiceStatus);

module.exports = router;