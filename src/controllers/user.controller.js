import { APIResponse } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";


const Register = asyncHandler(async function (req,res) {
    console.log(req.url);
    // get Data --> text Data
    // Validation for requiredFields :: username email password confirmPassword avatar 
    // check user Already Exists :: email - username 
    // add  the optional fields on onject if they are provided
    // check password and confirmPasswords are match
    // Access avatar and coverImage? req.files
    // .create() in DB
    // remove seensitive fields
    // return res 

    




    res
    .status(200)
    .json(
        new APIResponse("Response Success Full " , {} , 202)
    )
    
    
})


export {Register}