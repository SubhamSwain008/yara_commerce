import { upload_on_cloud } from "../../../utils/cloudinary.utils.js";

export const addProduct=async(req,res)=>{
    
    if(!req.file) return res.status(400).json({message:"please upload the image"});

    const filepath=req.file.path;
}