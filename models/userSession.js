import mongoose from "mongoose";

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

const SessionModel =  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default SessionModel;