import express from "express";
import {
  addService,
  getAllServices,
  getProviderServices,
  getServicesByCategory,
} from "../../controller/Grooming/groomingController.js";
import { protect } from "../../middleware/authMiddleware.js";

const groomingRouter = express.Router();

// Public routes
groomingRouter.get("/", getAllServices); // Can include ?category=pet_grooming query
groomingRouter.get("/category/:category", getServicesByCategory);

// Protected routes
groomingRouter.post("/service", protect, addService);
groomingRouter.get("/provider", protect, getProviderServices);

export default groomingRouter;
