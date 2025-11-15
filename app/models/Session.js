import mongoose from "mongoose";
import { number } from "motion";

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  ip: String,
  userAgent: String,
  fullName: String,
  phoneNumber: Number,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);