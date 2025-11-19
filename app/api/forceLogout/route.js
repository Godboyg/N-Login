import connectDB from "@/libs/db";
import SessionModel from "@/models/session";
import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";

export async function POST(request) {
    try{
        await connectDB();
        const body = await request.json();
        const { userAgent } = body;
        console.log("user agent", userAgent);

        // const agent = userAgent.split(" ")[0];

        if(!userAgent){
            return NextResponse.json({ message: "missing userAgent"} , { status: 400 })
        }

        const user = await SessionModel.deleteOne({ userAgent });

        if(user){
            const key = `invalid-session:${userAgent}`;
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