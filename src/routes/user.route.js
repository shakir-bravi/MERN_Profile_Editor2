import { Router } from "express";
import { Register } from "../controllers/user.controller.js";


const router = Router()


router.route("/register").post(Register) ; 

export {router}