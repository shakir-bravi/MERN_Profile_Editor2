import { APIResponse } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynchandler.utils.js";


const Register = asyncHandler(async function (req,res) {
    console.log(req.url);

    res
    .status(200)
    .json(
        new APIResponse("Response Success Full " , {} , 202)
    )
    
    
})


export {Register}