
import jwt from "jsonwebtoken"
import { APIEError } from "../utils/apierror.utils.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";
import { User } from "../models/user.model.js";
import { request } from "express";
// req.cookies?.accessToken ||


export const verifyJWT = asyncHandler( async (req,res , next) =>{

try {
        const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ",""); 
    if(!token){
        throw new APIEError("Invalid Request " , 404)
    }
    
    
    
     const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    //  console.log(    decodedToken);
    
    if(!decodedToken){
        throw new APIEError("Invalid Acceess Token ")
    }
    
    
    const findUser = await User.findById(decodedToken._id).select("-password -confirmPassword -refreshToken"); 
    
    
    // console.log(findUser);
    
    req.user = findUser
    next()
    
        // console.log(token);
        
    
} catch (error) {
 
throw new APIEError(error.message || "Invalid Access Token " , 403 )    
}
})