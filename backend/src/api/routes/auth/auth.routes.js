import express from "express";
import { mercahantSignup, mercahantSendOtp, mercahantVerifyOtp, mercahantLogin, merchantLogout, merchantAuth,merchantForgetPassowrd,mercahantChangePassword} from "../../contoller/auth/merchant.auth.controllers.js";

import { protectedRoute } from "../../../middleware/jwt.middleware.js";


const Auth_router = express.Router();

Auth_router.get("/running", (req, res) => {
    return res.status(200).json({ message: "backend is running" });
});

//mercahant or Admin login

Auth_router.post("/merch-signup", mercahantSignup);
Auth_router.get("/merch-otp", mercahantSendOtp);
Auth_router.get("/merch-otpv", mercahantVerifyOtp);
Auth_router.post("/merch-login", mercahantLogin);
Auth_router.post("/merch-logout", merchantLogout);
Auth_router.post("/merch-forgot",merchantForgetPassowrd);
Auth_router.post("/merch-changePassword",mercahantChangePassword);
Auth_router.post("/merch-authCheck", protectedRoute, merchantAuth);




//user login 

Auth_router.post("/signup", (req, res) => { });
Auth_router.post("/login", (req, res) => { });
Auth_router.post("/authCheck", (req, res) => { });





export default Auth_router;