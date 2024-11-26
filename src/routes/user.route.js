import { Router } from "express";
import { logInUser, logOutUser, Register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


router.route("/register").post(upload.fields( [{ name:"avatar" ,  maxCount:1} , {name:"coverImage", maxCount:1 }]),Register) ; 
router.route("/login").post(upload.none(),logInUser)

// Secure Routes


router.route("/logout").post( verifyJWT, logOutUser)

export {router}

