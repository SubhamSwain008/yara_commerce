import express from "express";
import { protectedRoute } from "../../../middleware/jwt.middleware.js";
import { uploadMulter } from "../../../middleware/multer.middleware.js";
import { addProduct } from "../../contoller/products/add_update_Products.controllers.js";
const ProductRoutes=express.Router();

ProductRoutes.post("/add-product",protectedRoute,uploadMulter.single("image"),addProduct);




export default ProductRoutes;