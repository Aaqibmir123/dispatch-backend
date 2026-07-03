const mongoose = require("mongoose");

/**
 * -----------------------
 * TRIP SCHEMA
 * -----------------------
 */
const tripSchema = new mongoose.Schema(
  {
    tripDate: { type: Date, required: true },
    vrid: { type: String, required: true, trim: true, uppercase: true },
    route: { type: String, trim: true },
    pickup: { type: String, trim: true },
    drop: { type: String, trim: true },
    totalCharges: { type: Number, default: 0 },
    dispatchPercent: { type: Number, default: 10 },
    dispatchPercentage: { type: Number, default: 10 },
    dispatchAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

/**
 * -----------------------
 * INVOICE SCHEMA
 * -----------------------
 */
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceType: {
      type: String,
      enum: ["single", "multiple", "Single", "Multiple"],
      default: "single",
    },

    // FIXED HERE: Saare valid enums invoiceSchema ke andar add kar diye hain
    invoiceStatus: {
      type: String,
      enum: ["draft", "sent", "paid", "cancelled", "approved", "rejected", "pending"],
      default: "draft",
      lowercase: true, // Input string auto-lowercase ho jayegi validation se pehle
    },

    currency: { type: String, default: "CAD" },
    transitNumber: String,
    institutionNumber: String,
    accountNumber: String,

    payee: {
      companyName: String,
      contactPerson: String,
      address1: String,
      address: String,
      phone: String,
      email: String,
      gstNumber: String,
      eTransferAddress: String,
      payeeSelectKey: String,
    },

    customer: {
      customerName: { type: String, required: false },
      companyName: String,
      contactPerson: String,
      address1: String,
      phone: String,
      email: String,
      gstNumber: String,
    },

    trips: { type: [tripSchema], required: true },

    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },

    pdfUrl: { type: String },

    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      lowercase: true,
    },
    emailSentAt: { type: Date },

    notes: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);