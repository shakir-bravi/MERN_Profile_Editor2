import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { unlinkSync } from 'node:fs';

// dotenv Configuration

dotenv.config({path:".env"})

// Clouadinary Configuration

cloudinary.config ( {
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET 
})


 export const uploadOnCloudinary  =async (filePath) =>{
    try {
        if(!filePath) return ;
        const respose = await cloudinary.uploader.upload(filePath)
        unlinkSync(filePath)
    return respose.url    
    } catch (error) {
        unlinkSync(filePath)
        console.log("File is Not Uploaded On Cloudinary " , error);
        
        
    }
 }