import Session from "@/models/Session";
import { NextResponse, userAgentFromString } from "next/server";

export async function POST(req) {
    try{
        const body = await req.json();

        const { userId , deviceId } = body;

        if(!userId || !deviceId) {
           return NextResponse.json({ message:"field missing" }, { status: 400 })
        }
 
        const user = await Session.findOneAndDelete({ userId , deviceId });

        const newSession = await Session.create({
            userId,
            deviceId
        })

        console.log("user session created",newSession);

        return NextResponse.json({ message: "new user session created" }, { status: 200 })

    } catch(error) {
        console.log("error",error);
    }
}