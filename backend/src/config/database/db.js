import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();


export const connectdb=async()=>{
    try{
        await mongoose.connect(process.env.MOGO_URI);
        console.log("db is connceted");

    }catch(e){
        console.log(e);
    }
}