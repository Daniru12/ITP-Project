import Review from "../../models/Reviews/review.js";
import User from "../../models/User.js";
import Service from "../../models/Service.js";

// Add a new review
export const addReview = async (req, res) => {
  try {
    const { service, rating, review } = req.body;
    const userId = req.user._id; // assuming you have authentication middleware that populates req.user

    // Check if the service exists
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Create a new review
    const newReview = new Review({
      user: userId,
      service,
      rating,
      review,
    });

    // Save the new review to the database
    await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};

// ✅ Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name").populate("service", "name");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// ✅ Get reviews for a specific service
export const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const reviews = await Review.find({ service: serviceId })
      .populate("user", "name")
      .populate("service", "name");

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching service reviews:", error);
    res.status(500).json({ message: "Error fetching service reviews", error: error.message });
  }
};


// ✅ Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    // Find the review
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner of the review
    if (existingReview.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only update your own reviews" });
    }

    // Update fields
    existingReview.rating = rating || existingReview.rating;
    existingReview.review = review || existingReview.review;
    existingReview.updatedAt = Date.now();

    await existingReview.save();

    res.status(200).json({
      message: "Review updated successfully",
      review: existingReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

// ✅ Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};
