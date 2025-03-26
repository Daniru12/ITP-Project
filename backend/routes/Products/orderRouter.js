import express from "express";
// Import controller functions
import { createOrder } from "../../controller/ProductsCRUD/OrderController.js";
//import { getAllOrders } from "../../controller/ProductsCRUD/OrderController.js";
//import { getOrderById } from "../../controller/ProductsCRUD/OrderController.js";
//import { updateOrder } from "../../controller/ProductsCRUD/OrderController.js";
//import { deleteOrder } from "../../controller/ProductsCRUD/OrderController.js";
//import { getOwnOrders } from "../../controller/ProductsCRUD/OrderController.js"; // Add this if you want to fetch orders specific to a user
import { protect } from "../../middleware/authMiddleware.js"; // Import the protect middleware

const orderRouter = express.Router();

// Create a new order (protected route)
orderRouter.post("/oder/:id", protect, createOrder);

// Get all orders (public route)
//orderRouter.get("/all", getAllOrders);

// Get a single order by ID (public route)
//orderRouter.get("/getOrder/:id", getOrderById);

// Update an order by ID (protected route)
//orderRouter.put("/update/:id", protect, updateOrder);

// Delete an order by ID (protected route)
//orderRouter.delete("/delete/:id", protect, deleteOrder);

// Get orders specific to the logged-in user (protected route)
//orderRouter.get("/own", protect, getOwnOrders);

export default orderRouter;