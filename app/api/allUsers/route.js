import { connectDB } from "@/libs/db";
import { NextResponse } from "next/server";
import Session from "@/models/Session";

export async function GET(req) {
    try{
        await connectDB();

        const users = await Session.find();

        return NextResponse.json({ message: "all users" , users})
    } catch (error){
        console.log("error",error);
    }
}