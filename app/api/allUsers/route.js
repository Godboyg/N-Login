import connectDB from "@/libs/db";
import { NextResponse } from "next/server";
import SessionModel from "@/models/session";

export async function GET(req) {
    try{
        await connectDB();

        const users = await SessionModel.find();

        return NextResponse.json({ message: "all users" , users})
    } catch (error){
        console.log("error",error);
    }
}