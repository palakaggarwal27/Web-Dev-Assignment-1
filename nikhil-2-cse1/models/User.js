// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  credit: {
    type: Number,
    default: 100,
  },
  collegeId: {
    type: Boolean,
    default: false,
  },
  collegeEmail: {
    type: String,
    default: "",
  },
  collegeName: {
    type: String,
    default: "",
  },
  studentId: {
    type: String,
    default: "",
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  verificationSubmittedAt: {
    type: Date,
  },
  otpCode: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  verifiedAt: {
    type: Date,
  },
  chatHistory: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite on hot-reload
export default mongoose.models.User || mongoose.model("User", userSchema);
