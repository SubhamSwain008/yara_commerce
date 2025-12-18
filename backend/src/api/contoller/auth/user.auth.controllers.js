import bcrypt from "bcrypt";
import  Users  from '../../../models/User.js';

import validator from "validator";
import { generateToken } from "../../../utils/jwt.utils.js";
import sendMail from '../../../utils/email.utils.js';


export const userSignup=async(req,res)=>{
    const {fullName,email,phoneNumber,password}=req.body;
    if(!fullName || !email || !phoneNumber || !password) return res.status(400).json({message:"please provide all the details"});
    //email validator
    if(!validator.isEmail(email)) return res.status(400).json({message:"please provide valid email"});
    //phone number validator
    if (!/^\d{10}$/.test(phoneNumber.toString())) { return res.status(400).json({ message: "Invalid phone number" }); }
    //find for exsisting user
    try{
      const findUser=await Users.findOne({$or:[{email},{phoneNumber}]});
      if(findUser){
        return res.status(400).json({message:"user already found in database , please login"});
      };
      const hashed_password=await bcrypt.hash(password,10);

      //create newuser

     
      const otp=Math.round(Math.random()*10000);
      const hashed_otp=await bcrypt.hash(String(otp),10);
      const sendingMail=await sendMail(email,otp);
      const newUser=new Users({fullName,email,phoneNumber,password:hashed_password,otp:hashed_otp});
      
      if(!sendingMail){
        return res.status(400).json({message:"unable to sent email"});
      }
      await newUser.save();
      return res.status(200).json({ message: "user created sucessful and otp sent suceessfully" });


    }catch (e){
        console.log(e)
        return res.status(500).json({message:"faild due to internal errors",error:e});
    }
    

    
    
}

export const UserOtpVerification=async(req,res)=>{
  const {email,otp}=req.body;
  if(!email || !otp) return res.status(400).json({message:"please provide all the details"});
  try{
    const findUser=await Users.findOne({email});
    if(!findUser) return res.status(400).json({message:"user not found"});
    const isOtpValid=await bcrypt.compare(String(otp),findUser.otp);
    if(!isOtpValid) return res.status(400).json({message:"invalid otp"});
    findUser.isVerified=true;
    findUser.otp=null;
    await findUser.save();
    return res.status(200).json({message:"user verified"});

  }catch(e){
    console.log(e);
    return res.status(500).json({message:"failed due to internal errors",error:e});
  }
};

export const UserLogin=async(req,res)=>{
 
  const {email,password}=req.body;


}