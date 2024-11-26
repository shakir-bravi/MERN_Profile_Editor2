import { Router } from "express";
import { changePassword, getUser, logInUser, logOutUser, Register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()



router.route("/register").post(upload.fields( [{ name:"avatar" ,  maxCount:1} , {name:"coverImage", maxCount:1 }]),Register) ; 
router.route("/login").post(upload.none(),logInUser)
router.route("/change-password").post(verifyJWT,upload.none(),changePassword)
// Secure Routes
router.route("/logout").post( verifyJWT, logOutUser)
router.route("/get").get(verifyJWT,getUser)



export {router}

