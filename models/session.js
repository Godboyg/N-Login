import mongoose, { Schema } from "mongoose";

const SessionSchema = new Schema({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  ip: String,
  userAgent: String,
  fullName: String,
  phoneNumber: Number,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

const SessionModel =  mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default SessionModel;