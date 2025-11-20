import { connectDB } from "@/libs/db";
import { NextResponse } from "next/server";
// import Session from "@/models/session";
import Session from "../../../models/session";
import mongoose from "mongoose";

export async function GET(req) {
    try{
        // await connectDB();
        mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ DB CONNECTED!"));

        const users = await Session.find();

        return NextResponse.json({ message: "all users" , users})
    } catch (error){
        console.log("error",error);
    }
}