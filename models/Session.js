import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId: { type: String },
    deviceId: { type: String },
    fullName: { type: String },
    phoneNumber: { type: Number },
    lastActive: { type: Date, default: Date.now },
})

const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session;