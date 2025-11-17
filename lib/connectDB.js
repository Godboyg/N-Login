import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("mongodb uri", MONGODB_URI)

if(!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in environment variables");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn: null , promise: null };
}

export async function connectDB(){
    if(cached.conn) return cached.conn;

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false
        }).then((mongoose) => {
            console.log("✅ DB connected!");
            return mongoose;
        }).catch((err) => {
          console.log("❌ MongoDB connection error:", err);
          throw err;
        });
        
    }

    cached.conn = await cached.promise;
    return cached.conn;
}