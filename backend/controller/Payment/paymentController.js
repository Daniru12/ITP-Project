import Payment from "../../models/Payment/payment.js";
import Appointment from "../../models/BookingScheduling/Appointment.js";
import Pet from "../../models/Pets.js";
import User from "../../models/User.js";
import Service from "../../models/Service.js";

 //Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { appointment_id, user_id, pet_id, service_id, amount, currency, payment_method, card_details } = req.body;

    // Validate appointment
    const appointment = await Appointment.findById(appointment_id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Validate pet
    const pet = await Pet.findById(pet_id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Validate service
    const service = await Service.findById(service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Validate user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate card details if payment method is "Card"
    if (payment_method === "Card" && (!card_details || !card_details.card_number || !card_details.card_holder_name || !card_details.expiration_date || !card_details.cvv)) {
      return res.status(400).json({ message: "Card details are required for card payments" });
    }

    // Create new payment
    const newPayment = new Payment({
      appointment_id,
      user_id,
      pet_id,
      service_id,
      amount,
      currency,
      payment_method,
      card_details: payment_method === "Card" ? card_details : null,
      status: "Pending",
    });

    // Save payment
    await newPayment.save();
    res.status(201).json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


 //desc Get a payment by ID
 
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("appointment_id user_id pet_id service_id");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get all payments

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("appointment_id user_id pet_id service_id");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Update payment status

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Completed", "Failed", "Refunded"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = status;
    
    // Generate transaction_id only when payment is completed
    if (status === "Completed" && !payment.transaction_id) {
      payment.transaction_id = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    await payment.save();
    res.status(200).json({ message: "Payment status updated", payment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Delete a payment

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
