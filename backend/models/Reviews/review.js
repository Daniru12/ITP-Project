import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    service: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Services", 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    review: { 
      type: String, 
      required: true 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true } 
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
