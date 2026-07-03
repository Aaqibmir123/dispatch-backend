const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // 👈 NEW ROLE FIELD ADDED WITH DEFAULT VALUE
    role: {
      type: String,
      enum: ["user", "admin"], 
      default: "user", 
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);