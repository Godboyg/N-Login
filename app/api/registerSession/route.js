import { connectDB } from "@/libs/db";
import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";
import User from "@/models/User";
import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import mongoose from "mongoose";
import { createUser } from "./create";

export async function OPTIONS(request) {
    return new NextResponse.json(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    })
}

export async function GET(request){
    try{
        // await connectDB();
        mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ DB CONNECTED!"));
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        console.log("userid",userId);

        const user = await User.find({ userId });
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
        // await connectDB();
        await mongoose.connect(process.env.MONGODB_URI)
        const body = await request.json();
        const { userId, ip, userAgent } = body;
        console.log("user info", userId , ip, userAgent);

        const MAX_DEVICES = 3;

        const deviceId = `${ip}_${userAgent?.slice(0,40)}`;

        const agent = userAgent.split(" ")[0];

        if(!userId){
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const user = await User.findOne({ userAgent });
        console.log("user in db",user);

        if(user){
            return NextResponse.json({ message: "User already logged in on this device." } , { status: 409 });
        }

        const activeSessions = await User.find({ userId });
        console.log("activesessions ", activeSessions);

        if(activeSessions.length >= MAX_DEVICES){
            console.log("not allowed!!");
            return NextResponse.json({ activeSessions })
        }

        const existingUser = await User.findOne({ userId , deviceId });
        console.log("existing user",existingUser);

        if(!existingUser){
            const newUser = await createUser(userId , deviceId , ip , userAgent);

            console.log("user newUser",newUser);

            return NextResponse.json({ 
                message: "Session Registered Successfully",
                newUser
             } , {
                status : 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                }
             })  
        }

        return NextResponse.json({ message: "Done!"})

        

        


            // const newUser = new User({
            //     userId,
            //     deviceId,
            //     ip,
            //     userAgent
            // });

            // await newUser.save();

            // return NextResponse.redirect(new URL("/", request.url));  
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
