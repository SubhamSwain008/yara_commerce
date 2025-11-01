import jwt from "jsonwebtoken"
import Merchants from "../models/Merchant.js";
import dotenv from "dotenv";
dotenv.config();



export const protectedRoute=async(req,res,next)=>{
   try{ 
    const token=req.cookies.jwt;
    if(!token) return res.status(400).json({message:"please login first"});
    const decode=jwt.verify(token,process.env.JWT_SECRECT);
    if(!decode) return res.status(400).json({message:"invalid token please login"});
    const user=await Merchants.findById(decode.userId);
    if(!user) return res.status(400).json({message:"invalid token please login"})
    
    req.user=user;
    next();
}

    catch(e){
            console.log(e);
            return res.status(400).json({message:"Token verification failed due to internal errors"});
    }
    
}