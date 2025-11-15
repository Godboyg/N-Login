import redis from "@/app/lib/redis";
import { NextResponse } from "next/server";

export async function POST(request){
    try{
        const { userAgent } = await request.json();

        const key = `invalid-session:${userAgent}`;

        const invalid = await redis.get(key);

        if(invalid){
            await redis.del(key);
            const data = JSON.parse(invalid);
            return NextResponse.json({ invalid: true, reason: data.reason })
        }

        return NextResponse.json({ invalid: false })
    }
    catch(error){
        console.log("error, ", error);
    }
}