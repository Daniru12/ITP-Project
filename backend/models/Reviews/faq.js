
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { 
      type: String, 
      required: true 
    },
    answer: { 
      type: String, 
      required: true 
    },
    service: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Services", 
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
    }
  },
  { timestamps: true } 
);

const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
