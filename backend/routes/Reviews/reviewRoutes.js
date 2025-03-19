import express from "express";
import {
  addReview,
  getServiceReviews,
  updateReview,
  deleteReview,
} from "../../controller/Reviews_and_Ratings/reviewController.js";

import { protect } from "../../middleware/authMiddleware.js";


const reviewRouter = express.Router();


reviewRouter.post("/create", protect, addReview); // Add a review
reviewRouter.get("/service/:serviceId", getServiceReviews); // Get all reviews for a service
reviewRouter.put("/update/:reviewId", protect, updateReview); // Update a review
reviewRouter.delete("/delete/:reviewId",deleteReview); // Delete a review

export default reviewRouter;
