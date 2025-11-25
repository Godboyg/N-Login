import { connectDB } from "@/libs/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";
import mongoose from "mongoose";
import Session from "@/models/Session";

export async function POST(request) {
    try{
        // await connectDB();
        mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ DB CONNECTED!"));
        const body = await request.json();
        const { userId , deviceId } = body;
        console.log("user agent", deviceId);

        // const agent = userAgent.split(" ")[0];

        if(!userId || !deviceId){
            return NextResponse.json({ message: "missing userAgent"} , { status: 400 })
        }

        const user = await Session.deleteOne({ userId , deviceId });

        if(user){
            const key = `invalid-session:${deviceId}`;
            await redis.set(
                key,
                JSON.stringify({
                     reason: "You were logged out from another device.",
                     timestamp: Date.now(),
                }),
                { ex: 86400 }
            )
        }

        console.log("all user deleted", user);

        return NextResponse.json({ message: "deleted session" , user} , { status: 200 })
    } catch (error) {
        console.log("error", error);
    }
}
