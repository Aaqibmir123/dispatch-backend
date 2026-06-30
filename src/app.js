const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const connectDB = require("./config/db");

const app = express();

// 1. DATABASE CONNECTION
connectDB();

// 2. 🔥 CORE CORS MIDDLEWARE (MUST BE ON TOP OF EVERYTHING)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ✅ FIXED: Added 'PATCH' because status change uses PATCH
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 3. 🔥 STRATEGIC OPTIONS OVERRIDE (Moved up before parsing layers)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

// 4. PARSING MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// 5. APPLICATION API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

module.exports = app;