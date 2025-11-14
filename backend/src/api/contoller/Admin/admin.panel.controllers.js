import Merchants from "../../../models/Merchant.js";

export const showUnverifiedMerchants=async(req,res)=>{
   if(!req.user.isAdmin) return res.status(400).json({message:"you are not admin!"});

   try{
     const user=await Merchants.find({isApprovedByAdmin:false}, "fullName email phoneNumber");

     return res.status(200).json({users:user});
   }
   catch(e){
      console.log(e);
      return res.status(400).json({message:"unable to find users due to internal errors"});
   }
}

export const verifyUsers=async(req,res)=>{
   
}