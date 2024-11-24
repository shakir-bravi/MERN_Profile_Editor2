import { User } from "../models/user.model.js";
import { APIEError } from "../utils/apierror.utils.js";
import { APIResponse } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";
import { uploadOnCloudinary } from "../utils/uploadoncloudinary.utils.js";



const generateAccessAndRefreshToken = async (userId)=>{
    try {
        // find User 
        // generate access and refreshToken
        // update the field of refretokn from database .save()
        // return access tokn and refrshtokn


        const findUser  =  await User.findById(userId) ; 
        const generateDAccessToken = await findUser.generateAccessToken ();
        const generateDRefrshToken = await findUser.generateRefreshToken ()  ;
        findUser.refreshToken = generateDRefrshToken ; 

        await findUser.save({validateBeforeSave:false})

        return { generateDAccessToken , generateDRefrshToken}
        
    } catch (error) {
        

throw  new APIEError("ERROR While GENErate Acceess and Refresh Token" , 403)
    }
}

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

const logInUser = asyncHandler( async (req,res,_)=>{
    console.log(req.url);
    // get data 
    // check for empty fileds
    // findOne in Db email and username
    // are password and confim are same
    // cpmare the hashd and plain password and confirm password 
    // generate tokens 
    // send cookies 



    // get data 
const {username , email , password , confirmPassword} = req.body; 
console.log(username , email , password , confirmPassword);

    // check for empty fileds
const requiredFields = ["username", "email" , "password", "confirmPassword"]
for(let  field of requiredFields){
    if(!req.body[field]){
        throw new APIEError(`${field} is Required !!!! ` , 403)
    }
}


    // are password and confim are same
    if(password != confirmPassword){
        throw new APIEError("password And Confirm Passwords Are Not Matched")
    }
    // findOne in Db email and username
const findUser =await User.findOne({ $and : [ { username}  ,{email }] })

// console.log(findUser);

if(!findUser){
    throw new APIEError("Sorry You Are not Sighn Up/ Registeered !!! First Registr Then Login" , 401)
}

    // cpmare the hashd and plain password and confirm password 
const isPasswordValid = await findUser.isPasswordCorrect(password)
const isConfirmPasswordValid = await findUser.isConfirmPasswordCorrect(confirmPassword) 

console.log(isConfirmPasswordValid,isPasswordValid);

if(!isPasswordValid || !isConfirmPasswordValid ){
    throw new APIEError("Passsword And Confirm Password Are Not Valid" , 404)
}

const {generateDAccessToken, generateDRefrshToken} = await generateAccessAndRefreshToken(findUser._id)
console.log(generateDAccessToken,generateDRefrshToken);

const options = {
    httpOnly : true,
    secure: true
}


const loggedInUser = await User.findById(findUser._id).select("-refreshToken -password -confirmPassword")

    res
    .status(200)
    .cookie("accessToken" , generateDAccessToken , options)
    .cookie("refreshToken" , generateDRefrshToken, options)
    .json(
        new APIResponse( "User LogIN Completed Success Fully !!" , { loggedInUser} , 201)
    )
    
})


export {Register , logInUser}