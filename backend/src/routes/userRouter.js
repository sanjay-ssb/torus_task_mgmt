import express from "express";
import {
    login,
    logout,
    myProfile,
    register
} from "../controllers/userController.js";
import {isAuthenticated} from "../middlewares/auth.js" 

const router=express.Router();

router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/myprofile",isAuthenticated,myProfile);
router.post("/register",register);


export default router;