import express from "express";
//import controller functions
import { createProduct } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { getAllProducts } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { getProductById } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { deleteProduct } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { updateProduct } from "../../controller/ProductsCRUD/productsContoller.js"; 
import { protect } from "../../middleware/authMiddleware.js"; // Import the protect middleware

const productRouter = express.Router();


productRouter.post("/create", protect, createProduct);

productRouter.get("/all", getAllProducts);

productRouter.get("/getProduct/:id", getProductById);

productRouter.delete("/delete/:id", protect, deleteProduct);

productRouter.put("/update/:id", protect, updateProduct);



export default productRouter;