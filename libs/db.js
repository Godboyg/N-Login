import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGOdb uri", MONGODB_URI)

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI inside .env.local");
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async() => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => {
      console.log("DB CONNECTED!");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;