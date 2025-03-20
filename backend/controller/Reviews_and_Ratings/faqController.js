import Faq from "../../models/Reviews/faq.js";
import Service from "../../models/Service.js";

// ✅ Add a new FAQ
export const addFaq = async (req, res) => {
  try {
    const { question, answer, service } = req.body;
    const userId = req.user?._id; // Assuming authentication middleware

    // Check if the service exists
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Create a new FAQ
    const newFaq = new Faq({
      question,
      answer,
      service,
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
    const faqs = await Faq.find()
      .populate("service", "name")
      .populate("user", "name"); // Populating user if exists
    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Error fetching FAQs", error: error.message });
  }
};

// ✅ Get FAQs for a specific service
export const getServiceFaqs = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const faqs = await Faq.find({ service: serviceId })
      .populate("service", "name")
      .populate("user", "name");

    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching service FAQs:", error);
    res.status(500).json({ message: "Error fetching service FAQs", error: error.message });
  }
};

// ✅ Update an FAQ
export const updateFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer, isActive } = req.body;

    // Find the FAQ
    const existingFaq = await Faq.findById(faqId);
    if (!existingFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Update fields
    existingFaq.question = question || existingFaq.question;
    existingFaq.answer = answer || existingFaq.answer;
    if (isActive !== undefined) existingFaq.isActive = isActive; // Allow toggling active state

    await existingFaq.save();

    res.status(200).json({ message: "FAQ updated successfully", faq: existingFaq });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Error updating FAQ", error: error.message });
  }
};

// ✅ Delete an FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
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
