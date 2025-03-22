import express from "express";
import { createProduct } from "../../controller/ProductsCRUD/productsContoller.js"; // Import the createProduct controller
import { protect } from "../../middleware/authMiddleware.js"; // Import the protect middleware

const productRouter = express.Router();

// Route to create a new product (protected for service providers and admins only)
productRouter.post("/create", protect, createProduct);

export default productRouter;