import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    category: {
      type: String,
      required: true,  
      enum: ['General', 'Financial', 'Technical', 'Related to Services'], 
      default: 'General'
    }
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);

export default Faq;



