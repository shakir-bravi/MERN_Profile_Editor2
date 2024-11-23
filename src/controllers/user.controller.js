import { User } from "../models/user.model.js";
import { APIEError } from "../utils/apierror.utils.js";
import { APIResponse } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";
import { uploadOnCloudinary } from "../utils/uploadoncloudinary.utils.js";


const Register = asyncHandler(async function (req,res) {
    console.log(req.url);
    // get Data --> text Data
    // Validation for requiredFields :: username email password confirmPassword avatar 
    // check user Already Exists :: email - username 
    // add  the optional fields on onject if they are provided
    // check password and confirmPasswords are match
    // Access avatar and coverImage? req.files
    // upload on Cloudinaary And Access URL ; 
    // .create() in DB
    // remove sensitive fields
    // send Email 
    // return res 

    // a7zgS17YrNUWeip4
    // shakirbrahvi5t

    // get Data --> text Data
    const {name , username , cast , email , password ,confirmPassword } = req.body; 
console.log(name,username ,cast,email ,password ,confirmPassword);

const providedFields = {} ; 

const requiredFields = ["username" , "email" , "password" , "confirmPassword"] ; 


for(let field of requiredFields){
    if(!req.body[field]){
        throw new APIEError(`${field} is Requird :)` , 403)
    }   }

 
    const existdUser = await User.findOne({ $and:[ {username} ,{email }]})
    if(existdUser){
        throw new APIEError("User Already Existed ,, Try Another User" , 404)
    }

    if(password !== confirmPassword){
        throw new APIEError("Passsword And ConfimPassword Are not Matched :) " , 403)
    }



providedFields.username = username
providedFields.email = email
providedFields.password = password ; 
providedFields.confirmPassword  = confirmPassword
if(name) providedFields.name = name;
if(cast) providedFields.cast  = cast ; 



let avatar ;
if(req.files.avatar){
 avatar = req.files?.avatar[0].path;
}
else{
    throw new APIEError("Avatar is Required :)" , 403)
}
let coverImage ; 
if(req.files.coverImage){
coverImage = req.files.coverImage[0].path ;
}
else{
    coverImage = null
}


const avatarURL = await uploadOnCloudinary(avatar)
const coverImageURL = await uploadOnCloudinary(coverImage)

console.log(avatarURL , coverImageURL);


const createUser = await User.create( {
...providedFields, 
    avatar :avatarURL,
    coverImage : coverImageURL || ""
})

const  findUser = await User.findById(createUser._id).select("-password -confirmPassword -refreshToken")
if(!findUser){
    throw new APIEError("Eror When User Created  :)" , 502)
}

    res
    .status(200)
    .json(
        new APIResponse("User Regissteered Success Fully !!!" , findUser , 202)
    )
    
    
})


export {Register}