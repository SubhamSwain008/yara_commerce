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
   if(!req.user.isAdmin) return res.status(400).json({message:"you are not admin!"});

   const {email}= req.body;

   if(!email) return res.status(200).json({message:"provide the email first"});

   try{
      const userToUpdate=await Merchants.findOne({email});
      if(!userToUpdate) return res.status(400).json({message:"user not found"});
      userToUpdate.isApprovedByAdmin=true;
      userToUpdate.save();
      return res.status(200).json({message:"user approved by admin"});

   }catch(e){
      console.log(e);
      return res.status(400).json({message:"can not verify user due to internal errors"})
   }

   
}

export const showAllMerchants=async(req,res)=>{
   if(!req.user.isAdmin) return res.status(400).json({message:"you are not admin!"});
   try{
   const users= await Merchants.find({isApprovedByAdmin:true ,isAdmin: false}, "fullName email phoneNumber");
   if(!users) return res.status(404).json({message:"no user found"});

   return res.status(200).json({message:"users found",users:users});
   }
   catch(e){
      return res.status(200).json({message:"failed to find merchants due to internal errors"});
   }
   }