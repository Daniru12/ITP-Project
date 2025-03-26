import express from "express";
//import controller functions
import { createProduct } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { getAllProducts } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { getProductById } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { deleteProduct } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { updateProduct } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { getOwnProducts } from "../../controller/ProductsCRUD/productsContoller.js";
import { protect } from "../../middleware/authMiddleware.js"; // Import the protect middleware

const productRouter = express.Router();

// Public routes
productRouter.get("/all", getAllProducts);

// Protected routes
productRouter.post("/create", protect, createProduct);
productRouter.get("/own", protect, getOwnProducts);
productRouter.delete("/delete/:id", protect, deleteProduct);
productRouter.put("/update/:id", protect, updateProduct);
productRouter.get("/:id", getProductById);

export default productRouter;