
import mongoose from "mongoose";
import User from "@/models/User";

export const createUser = async(userId , deviceId , ip , userAgent) =>{

    mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ DB CONNECTED!"));

    const newUser = new User({
        userId,
        deviceId,
        ip,
        userAgent
    })

    await newUser.save();

    const user = await User.findOne({ userId , deviceId });
    console.log("this! user",user);

    const reCreate = new User({
          userId,
          deviceId,
          ip,
          userAgent
    })

    await reCreate.save();
    return reCreate;
}
