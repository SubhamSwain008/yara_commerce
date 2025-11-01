import {v2 as cloud} from "cloudinary";
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

 cloud.config({ 
        cloud_name:process.env.CLOUDINARY_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRECT // Click 'View API Keys' above to copy your API secret
    });

export const upload_on_cloud=async(localfilePath)=>{
 try{ 
    if(!localfilePath){ console.log("file path not provided"); return -1;}

    const cloudRes=await cloud.uploader.upload(localfilePath,{resource_type:"auto"});

    return cloudRes;
 }catch(e){
    console.log("cloudinary upload failed",e);
    fs.unlinkSync(localfilePath);
    return -1;
 }
}