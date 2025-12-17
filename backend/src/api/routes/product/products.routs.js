import express from "express";
import { protectedRoute } from "../../../middleware/jwt.middleware.js";
import { uploadMulter } from "../../../middleware/multer.middleware.js";
import { addProduct } from "../../contoller/products/add_update_Products.controllers.js";
import { ListProducts,ListAllProducts } from "../../contoller/products/listProducts.js";
const ProductRoutes=express.Router();

ProductRoutes.post("/add-product",protectedRoute,uploadMulter.single("image"),addProduct);
ProductRoutes.post("/list-product",protectedRoute,ListProducts);

ProductRoutes.post("/all-product",protectedRoute,ListAllProducts);

export default ProductRoutes;