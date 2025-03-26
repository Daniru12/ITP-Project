import express from "express";
// Import controller functions
import { createOrder, getOwnOrders } from "../../controller/ProductsCRUD/OrderController.js";
import { protect } from "../../middleware/authMiddleware.js"; // Import the protect middleware

const orderRouter = express.Router();

// Create a new order (protected route)
orderRouter.post("/create", protect, createOrder);

// Get orders specific to the logged-in user (protected route)
orderRouter.get("/own", protect, getOwnOrders);

export default orderRouter;