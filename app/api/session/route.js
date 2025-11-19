import { NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import SessionModel from "@/models/userSession";

export async function GET(request){
    try{
        await connectDB();
        const { searchParams } =  new URL(request.url);
        const userAgent = searchParams.get("userAgent");

        console.log("user AGENT", userAgent);

        // const userAgent = User.trim();

        const user = await SessionModel.findOne({ userAgent });

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
    const { userAgent ,fullName, phoneNumber } = await req.json();

    console.log("full name and phone number", userAgent , fullName , phoneNumber);

    if (!fullName && !phoneNumber) {
      return NextResponse.json(
        { message: "Provide fullName or phoneNumber" },
        { status: 400 }
      );
    }

    const user = await SessionModel.findOne({ userAgent });

    if(!user){
        return NextResponse.json({ message: "user not found!"}, { status: 400});
    }

    if(!user.phoneNumber && !user.fullName){
        // const updatedSession = await Session.findByIdAndUpdate(
        //  userAgent,
        //   {
        //     ...(fullName && { fullName }),
        //     ...(phoneNumber && { phoneNumber }),
        //   },
        //   { new: true }
        // );

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