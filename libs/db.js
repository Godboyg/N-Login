// 

import mongoose from "mongoose"

export const connectDB = async() => {
  try{
    mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ DB CONNECTED!"));
    // console.log("✅ DB CONNECTED!");
  } catch(error) {
    console.log("error",error);
  }
}