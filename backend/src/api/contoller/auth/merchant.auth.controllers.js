import bcrypt from "bcrypt"
import Merchants from "../../../models/Merchant.js";
import sendMail from "../../../utils/email.utils.js";
import validator from "validator";
import { generateToken } from "../../../utils/jwt.utils.js";

export const mercahantSignup = async (req, res) => {
    const { email, fullName, phoneNumber, password } = req.body;


    if (!email || !fullName || !phoneNumber || !password) {
        return res.status(400).json({ message: "merchant details missing missing" });
    }

    //phone number validator
    if (!/^\d{10}$/.test(phoneNumber.toString())) { return res.status(400).json({ message: "Invalid phone number" }); }

    //email validator
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }


    //find for exsisting user
    const find = await Merchants.findOne({ $or: [{ email }, { phoneNumber }] });
    if (find) return res.status(400).json({ message: "user already found in Database" });

    //password hasing
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashed_password = await bcrypt.hash(password, salt);

    //creates new mwerchant with schema 
    const newMerchant = new Merchants({ email, fullName, phoneNumber, password: hashed_password });

    try {


        const mailRes = await sendMail(email);
        //updates the db
        const userRes = await newMerchant.save();
        const { password: _, isAdmin, emailVerified, otp, isApprovedByAdmin, ...protected_user } = userRes.toObject();
        return res.status(200).json({ message: "user created", protected_user, mailRes });


    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "due to invalid email or an internal error signup failed", e });
    }


}
export const mercahantSendOtp = async (req, res) => {

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email field is empty" });

    const otp = Math.round(Math.random() * 10000);
    // console.log(otp);
    const user = await Merchants.findOne({ email });

    if (!user) return res.status(400).json({ message: "user not found please register first" });

    user.otp = otp;
    try {
        await user.save();
        const send = await sendMail(email, otp);
        return res.status(200).json({ message: "otp sent suceessfully" });

    } catch (e) {
        return res.status(400).json({ message: "failed to send otp may be email is incorrect or internal issues" });
    }


}
export const mercahantVerifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!otp) return res.status(400).json({ message: "please enter otp" });
    else if (!email) return res.status(400).json({ message: "email field is empty" });
    try {
        const user = await Merchants.findOne({ email });
        if (!user) return res.status(400).json({ message: "user not found please register first" });
        if (user.otp === otp) {
            user.emailVerified = true;
            user.otp = null;
            await user.save();
            return res.status(200).json({ message: "otp validation suceessfully" });
        } else {
            return res.status(400).json({ message: "otp validation unsuceessfully, wrong otp!" });
        }
    } catch (e) {
        return res.status(400).json({ message: "otp verification failed due to internal error" });
    }



}

export const mercahantLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Merchants.findOne({ email });
        if (!user) return res.status(400).json({ message: "user not found please login" });
        if (!user.emailVerified) return res.status(400).json({ message: "please verify user email before login" });
        const isUserValid = await bcrypt.compare(password, user.password);
        if (!isUserValid) return res.status(400).json({ message: "Invalid password" });

        generateToken(user._id, res);

        return res.status(200).json({ message: "login sucessful", id: user._id, email: user.email, name: user.fullName });

    } catch (e) {
        console.log("error", e)
        return res.status(400).json({ message: "failed to login due to internal error" });
    }

}

export const merchantLogout = async (req, res) => {
    console.log("logout");
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ "message": "user logged out" });
}

export const merchantAuth = async (req, res) => {

    if (!req.user) return res.status(400).json({ message: "user not found please login again" });
    const user = req.user;
    return res.status(200).json({ message: "auth sucess", id: user._id, email: user.email, fullName: user.fullName });
}

export const merchantForgetPassowrd=async(req,res)=>{
    const {email}=req.body;
    if(!email || !req.body) return res.status(400).json({message:"please provie the email"});

    const otp= Math.round(Math.random()*10000);
    const user= await Merchants.findOne({email});
    if(!user) return res.status(400).json({message:"user not found please register"});

    user.otp=otp;

    try{
       await user.save();
       const send=await sendMail(email,otp);
       return res.status(200).json({message:"otp sent sucessfully"});

    }
    catch(e){
        console.log(e);
        return res.status(400).json({message:"failed to send otp due to internal error"});
    }

}
export const mercahantChangePassword=async(req,res)=>{
    const {email,otp,password}=req.body;

    if(!otp || !email) return res.status(400).json({message:" otp is missing or invalid"});
    if(!password) return res.status(400).json({message:"provide password "});

    const user= await Merchants.findOne({email});
    if(!user) return res.status(404).json({message:"user not found please try sending otp again"});
   try{

   
    if(user.otp===otp){
        user.otp=null;

        const saltRound=10;
        const salt= await bcrypt.genSalt(saltRound);
        const hashed_password=await bcrypt.hash(password,salt);

        user.password=hashed_password;

        await user.save();

        return res.status(200).json({message:"password changed"});

    }else{
        return res.status(400).json({message:"otp didn't match, try resending otp "});
    }
}
catch(e)
    {    
        console.log(e);
        return res.status(400).json({message:"failed due to internal error",e})
    }
}

