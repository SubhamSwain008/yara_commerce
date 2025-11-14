import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectdb } from './src/config/database/db.js';
import Auth_router from './src/api/routes/auth/auth.routes.js';
import ProductRoutes from './src/api/routes/product/products.routs.js';
import cookieParser from "cookie-parser";
import adminRouter from './src/api/routes/admin/admin.panel.routes.js';

;(async()=>{
    await connectdb();
})();



const app=express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",Auth_router);
app.use("/api/admin",adminRouter);
app.use("/api/products",ProductRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`deafult path http://localhost:${process.env.PORT}/api/auth/running`);
});