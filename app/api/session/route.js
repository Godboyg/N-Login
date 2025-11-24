import { NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import User from "@/models/User";
import Session from "@/models/Session";
import mongoose from "mongoose";

export async function GET(request){
    try{
        // await connectDB();
        mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ DB CONNECTED!"));
        const { searchParams } =  new URL(request.url);
        const deviceId = searchParams.get("deviceId");

        console.log("deviceId !", deviceId);

        // const userAgent = User.trim();

        const user = await Session.findOne({ deviceId });

        console.log("user found", user);

        if(!user){
            return NextResponse.json({ message: "user not found" }, { status: 400 })
        }

        return NextResponse.json({ message: "found", user}, { status: 200})

        // if(!user.fullName && !user.
    } catch (error) {
        console.log("error", error);
    }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const { userId , deviceId ,fullName, phoneNumber } = await req.json();

    console.log("full name and phone number", userId , deviceId , fullName , phoneNumber);

    if (!fullName && !phoneNumber) {
      return NextResponse.json(
        { message: "Provide fullName or phoneNumber" },
        { status: 400 }
      );
    }

    const user = await Session.findOne({ userId , deviceId });

    if(!user){
        return NextResponse.json({ message: "user not found!"}, { status: 400});
    }

    if(!user.phoneNumber && !user.fullName){
        user.fullName = fullName;
        user.phoneNumber = phoneNumber;

        user.lastActive = new Date();

        await user.save();

        return NextResponse.json({
          message: "Session updated successfully",
          session: user,
        });
    }
  } catch (error) {
    console.error("Session update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}