import jwt from "jsonwebtoken";


export const generateToken=(userId,res)=>{
     
    const token =jwt.sign({userId},process.env.JWT_SECRECT,{expiresIn:"1d",});

    res.cookie("jwt",token,{
        maxAge:1000*60*60*48,
        httpOnly: true,
        secure: true, // required for cross-site over HTTPS
        sameSite: "none", 

    });

    return token;

}