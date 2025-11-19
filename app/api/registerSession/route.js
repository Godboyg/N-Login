import { connectDB } from "@/libs/db";
import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";
import Session from "@/models/userSession";
import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";

export async function GET(request){
    try{
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        console.log("userid",userId);

        const user = await Session.find({ userId });
        // const user = await Session.find();

        if(!user){
            return NextResponse.json(
                {
                    message: "no user found"
                }, 
                {
                    status: 400
                }
            )
        }

        return NextResponse.json({ user });
    }
    catch (error) {
        console.log("error: ",error);
    }
}

export async function POST(request){
    try{
        await connectDB();
        const body = await request.json();
        const { userId, ip, userAgent } = body;
        console.log("user info", userId , ip, userAgent);

        const MAX_DEVICES = 3;

        const deviceId = `${ip}_${userAgent?.slice(0,40)}`;

        const agent = userAgent.split(" ")[0];

        if(!userId){
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const user = await Session.findOne({ userAgent });

        if(user){
            return NextResponse.json({ message: "User already logged in on this device." } , { status: 409 });
        }

        const activeSessions = await Session.find({ userId });
        // console.log("activesessions ", activeSessions);

        if(activeSessions.length >= MAX_DEVICES){
            console.log("not allowed!!");
            return NextResponse.json({ activeSessions })
        }

        if(activeSessions.length < MAX_DEVICES && !user){
            const newUser = await Session.create({
                userId,
                deviceId,
                ip,
                userAgent,
            })

            console.log("new user",newUser);

            // return NextResponse.redirect(new URL("/", request.url));

            return NextResponse.json({ 
                message: "Session Registered Successfully"
             } , {
                status : 200
             })    
        }
    } 
    catch (error) {
        console.error("Error registering session:", error);
        return NextResponse.json(
            {
                error: "internal Serror error!!"
            } , 
            {
                status : 500
            }
        )
    }
}