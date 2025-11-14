import { showUnverifiedMerchants, verifyUsers ,showAllMerchants } from "../../contoller/Admin/admin.panel.controllers.js";
import { protectedRoute } from "../../../middleware/jwt.middleware.js";
import express from "express";



const adminRouter= express.Router();

adminRouter.get("/running",(req,res)=>{

    res.json({message:"admin route is running"});
});
adminRouter.post("/show-unverified",protectedRoute,showUnverifiedMerchants);
adminRouter.post("/show-verified",protectedRoute,showAllMerchants);
adminRouter.post("/verify-users",protectedRoute,verifyUsers);


export default adminRouter;

