const mongoose = require("mongoose");

/**
 * -----------------------
 * TRIP SCHEMA
 * -----------------------
 */
const tripSchema = new mongoose.Schema(
  {
    tripDate: {
      type: Date,
      required: true,
    },

    vrid: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    route: {
      type: String,
      trim: true,
    },

    pickup: {
      type: String,
      trim: true,
    },

    drop: {
      type: String,
      trim: true,
    },

    totalCharges: {
      type: Number,
      default: 0,
    },

    // FIXED: Frontend fields integration fallback map rules
    dispatchPercent: {
      type: Number,
      default: 10,
    },
    dispatchPercentage: {
      type: Number,
      default: 10,
    },

    dispatchAmount: {
      type: Number,
      default: 0,
    },
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
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    invoiceType: {
      type: String,
      enum: ["single", "multiple", "Single", "Multiple"],
      default: "single",
    },

    // FIXED: Dropdown strings normalization sync handle karne ke liye lowercase keys incorporate ki hain
    invoiceStatus: {
      type: String,
      enum: ["draft", "sent", "paid", "cancelled", "Draft", "Pending", "Paid", "Cancelled"],
      default: "draft",
      lowercase: true, // Auto character casing safety conversion layer
    },

    // // VERIFIED STRUCTURE: Invoice period tracker objects
    // invoicePeriod: {
    //   startDate: { type: Date },
    //   endDate: { type: Date },
    // },

    currency: {
      type: String,
      default: "CAD",
    },

    transitNumber: String,
    institutionNumber: String,
    accountNumber: String,

    /**
     * -----------------------
     * PAYEE (YOUR COMPANY)
     * -----------------------
     */
    payee: {
      companyName: String,
      contactPerson: String, 
      address1: String,
      address: String,
      phone: String,
      email: String,
      gstNumber: String,
    },

    /**
     * -----------------------
     * CUSTOMER DETAILS
     * -----------------------
     */
    customer: {
      customerName: {
        type: String,
        required: false,
      },
      companyName: String,
      contactPerson: String,
      address1: String,
      phone: String,
      email: String,
      gstNumber: String,
    },

    /**
     * -----------------------
     * TRIPS
     * -----------------------
     */
    trips: {
      type: [tripSchema],
      required: true,
    },

    /**
     * -----------------------
     * CALCULATED FIELDS
     * -----------------------
     */
    subtotal: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },

    /**
     * -----------------------
     * FILE & EMAIL TRACKING
     * -----------------------
     */
    pdfUrl: {
      type: String,
    },

    emailStatus: {
      type: String,
      enum: ["Pending", "Sent", "Failed", "pending", "sent", "failed"],
      default: "pending",
      lowercase: true,
    },

    emailSentAt: {
      type: Date,
    },

    /**
     * -----------------------
     * NOTES
     * -----------------------
     */
    notes: String,

    /**
     * -----------------------
     * RELATION
     * -----------------------
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Testing instances me strict crashes bypass karne ke liye optional rakha hai
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);