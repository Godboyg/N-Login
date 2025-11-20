import { NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // or 'http://localhost:3000'
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function DELETE(request) {
    try{
        // await connectDB();
        mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ DB CONNECTED!"));
        const body = await request.json();
        const { userAgent } = body;
        console.log("user agent!!!", userAgent);

        // const agent = userAgent.split(" ")[0];

        if(!userAgent){
            return NextResponse.json({ message: "missing userAgent" }, { status: 400 });
        }

        const user = await User.deleteOne({ userAgent });

        console.log("all user deleted", user);

        return NextResponse.json(
            { message: "Session Deleted", user}, 
            { status: 200 , 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                }
            }
        )
    }
    catch (error){
        console.log("error ", error);
    }
}