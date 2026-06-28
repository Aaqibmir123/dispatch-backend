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
      index: true, // 🔥 important for fast lookup
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// extra compound index (future scaling)
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);