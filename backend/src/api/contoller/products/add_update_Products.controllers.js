import Product from "../../../models/Products.js";
import { upload_on_cloud } from "../../../utils/cloudinary.utils.js";
import fs from "fs";

export const addProduct=async(req,res)=>{
    const user= req.user;
    if(!user.isApprovedByAdmin) return res.status(400).json({message:"ask for admin approval before listing products"})
    const {name,price,catagory,description,specification}=req.body;
    
    if(!req.file) return res.status(400).json({message:"please upload the image"});
    if(!name||!price||!catagory||!description||!specification) return res.status(400).json({message:"prodcut details are messing"});

    const filepath=req.file.path;
  try{
    const url=await upload_on_cloud(filepath);

    if(fs.existsSync(filepath)){
        fs.unlinkSync(filepath);
    }
    const newProduct= new Product({
        name,
        price,
        catagory,
        description,
        specification,
        picture:url.secure_url,
        seller:req.user._id
    })
    user.Products=[...user.Products,newProduct._id]

   const prodRes=await newProduct.save();

   await user.save();


    return res.status(200).json({message:"product added",prodRes});

} catch(e){
    console.log(e);
    return res.status(400).json({message:"prodcut could not be added due to internal errors"});
}
}