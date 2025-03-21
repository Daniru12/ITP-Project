import express from "express";
import {
  addService,
  getProviderServices,
  getServicesByCategory,
} from "../../controller/Servicess/serviceController.js";
import { protect } from "../../middleware/authMiddleware.js";

const groomingRouter = express.Router();

// Public routes
groomingRouter.get("/category/:category", getServicesByCategory);

// Protected routes
groomingRouter.post("/service", protect, addService);
groomingRouter.get("/provider", protect, getProviderServices);

export default groomingRouter;