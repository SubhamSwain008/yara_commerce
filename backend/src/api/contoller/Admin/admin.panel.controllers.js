
export const showUnverifiedMerchants=async(req,res)=>{
   if(!req.user.isAdmin) return res.status(400).json({message:"you are not admin!"})
}