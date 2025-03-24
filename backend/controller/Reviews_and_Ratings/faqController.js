import Faq from "../../models/Reviews/faq.js";
import User from "../../models/User.js";

// ✅ Add a new FAQ
export const addFaq = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user?._id; // Assuming authentication middleware

    // Create a new FAQ
    const newFaq = new Faq({
      question,
      user: userId || null, // If the FAQ is added by an admin, userId may be null
    });

    // Save to database
    await newFaq.save();

    res.status(201).json({ message: "FAQ added successfully", faq: newFaq });
  } catch (error) {
    res.status(500).json({ message: "Error adding FAQ", error: error.message });
  }
};

// ✅ Get all FAQs
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().populate("user", "name"); // Populating user if exists
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Error fetching FAQs", error: error.message });
  }
};

// ✅ Get a single FAQ by ID
export const getFaqById = async (req, res) => {
  try {
    const { faqId } = req.params;
    const faq = await Faq.findById(faqId).populate("user", "name");
    
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    res.status(500).json({ message: "Error fetching FAQ", error: error.message });
  }
};

// ✅ Update an FAQ (Only the user who created it can update it)
export const updateFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question } = req.body;
    const userId = req.user?._id;

    // Find the FAQ
    const existingFaq = await Faq.findById(faqId);
    if (!existingFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Check if the user is the owner
    if (existingFaq.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own FAQ." });
    }

    // Update the question
    existingFaq.question = question || existingFaq.question;
    await existingFaq.save();

    res.status(200).json({ message: "FAQ updated successfully", faq: existingFaq });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Error updating FAQ", error: error.message });
  }
};

// ✅ Delete an FAQ (Only admin and service provider can delete it)
export const deleteFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
    const userRole = req.user?.role; // Assuming role is available in authentication middleware

    if (user_type !== "admin" && user_type !== "service_provider") {
      return res.status(403).json({ message: "Unauthorized: Only admin and service providers can delete FAQs." });
    }

    const deletedFaq = await Faq.findByIdAndDelete(faqId);
    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: "Error deleting FAQ", error: error.message });
  }
};
