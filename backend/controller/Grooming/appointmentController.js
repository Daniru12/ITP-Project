import Appointment from "../../models/Booking&Scheduling/Appointment.js";
import Pet from "../../models/Pets.js";
import GroomingService from "../../models/Service.js";
import { calculateLoyaltyPoints, calculateDiscount } from "../../utils/loyaltyHelper.js";
import User from "../../models/User.js";

// Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    // Check if the pet belongs to the user
    const pet = await Pet.findOne({
      _id: req.body.pet_id,
      owner_id: req.user._id,
    });

    if (!pet) {
      return res
        .status(403)
        .json({ message: "Pet not found or not owned by user" });
    }

    // Check if user wants to use loyalty points
    const usePoints = req.body.usePoints === true;
    let discount = 0;

    if (usePoints) {
      const user = await User.findById(req.user._id);
      discount = calculateDiscount(user.loyalty_points);

      // Deduct points if discount is applied
      if (discount > 0) {
        user.loyalty_points = 0; // Reset points after use
        await user.save();
      }
    }

    const newAppointment = new Appointment({
      ...req.body,
      status: "pending",
      discount_applied: discount,
      package_type: req.body.package_type
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
      discountApplied: discount
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking appointment", error: error.message });
  }
};

// Get user's appointments
export const getUserAppointments = async (req, res) => {
  try {
    const pets = await Pet.find({ owner_id: req.user._id });
    const petIds = pets.map((pet) => pet._id);

    const appointments = await Appointment.find({ pet_id: { $in: petIds } })
      .populate("pet_id")
      .populate({
        path: "service_id",
        populate: {
          path: "provider_id",
          select: "username full_name",
        },
      });

    if (appointments.length === 0) {
      return res.status(200).json({
        message: "No appointments found for this user",
        appointments: [],
      });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// Get service provider's appointments
// This function gets all appointments for a service provider
export const getProviderAppointments = async (req, res) => {
  try {
    // First, we check if the user trying to access this is actually a service provider
    // If they're not, we return an error message
    if (req.user.user_type !== "service_provider") {
      return res.status(403).json({
        message: "Sorry, this feature is only available for service providers",
      });
    }

    // Next, we find all the services that belong to this provider
    // We use their user ID to find their services
    const providerServices = await GroomingService.find({
      provider_id: req.user._id,
    });

    // We create a list of all the service IDs that belong to this provider
    const serviceIds = providerServices.map((service) => service._id);

    // Now we search for all appointments that are booked for any of these services
    // We also:
    // 1. Include the pet's information using populate("pet_id")
    // 2. Include service details like name, price and duration
    // 3. Sort appointments by date (earliest first)
    const appointments = await Appointment.find({
      service_id: { $in: serviceIds },
    })
      .populate("pet_id")
      .populate({
        path: "service_id",
        select: "service_name price duration",
      })
      .sort({ appointment_date: 1 });

    // If we don't find any appointments, we return an empty list with a message
    if (appointments.length === 0) {
      return res.status(200).json({
        message: "You don't have any appointments yet",
        appointments: [],
      });
    }

    // If we found appointments, we return them with a success message
    res.status(200).json({
      message: "Successfully found your appointments!",
      appointments: appointments,
    });
  } catch (error) {
    // If anything goes wrong, we return an error message
    res.status(500).json({
      message: "Sorry, we couldn't fetch your appointments",
      error: error.message,
    });
  }
};

// This function lets service providers accept or reject appointments
export const updateAppointmentStatus = async (req, res) => {
  try {
    // Basic validation
    if (req.user.user_type !== "service_provider") {
      return res.status(403).json({
        message: "Only service providers can update appointment status"
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || (status !== "confirmed" && status !== "rejected")) {
      return res.status(400).json({
        message: "Status must be either 'confirmed' or 'rejected'"
      });
    }

    // Find appointment and update status using findByIdAndUpdate to avoid validation issues
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { 
        new: true,
        runValidators: false  // Disable validation since we're only updating status
      }
    );
    
    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    // Get service to verify provider
    const service = await GroomingService.findById(appointment.service_id);
    
    // Verify service provider ownership
    if (service.provider_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update appointments for your services"
      });
    }

    // Handle loyalty points for confirmed appointments
    if (status === "confirmed") {
      const pet = await Pet.findById(appointment.pet_id);
      const petOwner = await User.findById(pet.owner_id);
      
      const pointsEarned = calculateLoyaltyPoints(appointment.package_type);
      petOwner.loyalty_points += pointsEarned;
      await petOwner.save();

      return res.status(200).json({
        message: "Appointment confirmed successfully",
        appointment,
        pointsEarned,
        totalPoints: petOwner.loyalty_points
      });
    }

    // Response for rejected appointments
    res.status(200).json({
      message: "Appointment updated successfully",
      appointment
    });

  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      message: "Failed to update appointment",
      error: error.message
    });
  }
};

// This function lets service providers remove appointments
export const deleteAppointment = async (req, res) => {
  try {
    // Step 1: Make sure the user is a service provider
    const isServiceProvider = req.user.user_type === "service_provider";
    if (!isServiceProvider) {
      return res.status(403).json({
        message: "You need to be a service provider to delete appointments",
      });
    }

    // Step 2: Get the appointment ID from the request
    const appointmentId = req.params.id;

    // Step 3: Find the appointment in our database
    const appointment = await Appointment.findById(appointmentId).populate({
      path: "service_id",
      select: "provider_id service_name",
    });

    // Step 4: Check if we found the appointment
    if (!appointment) {
      return res.status(404).json({
        message: "We couldn't find this appointment",
      });
    }

    // Step 5: Make sure the appointment belongs to this service provider
    const isProviderAppointment =
      appointment.service_id.provider_id.toString() === req.user._id.toString();
    if (!isProviderAppointment) {
      return res.status(403).json({
        message: "This appointment doesn't belong to your services",
      });
    }

    // Step 6: Don't allow deleting completed appointments
    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Sorry, you can't delete completed appointments",
      });
    }

    // Step 7: Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);

    // Step 8: Send back success message
    res.status(200).json({
      message: "The appointment has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleting the appointment",
      error: error.message,
    });
  }
};

// Add this new function to handle user appointment cancellation
export const cancelAppointment = async (req, res) => {
  try {
    // Get appointment ID from params
    const appointmentId = req.params.id;

    // Find the appointment and populate pet info to verify ownership
    const appointment = await Appointment.findById(appointmentId)
      .populate("pet_id")
      .populate({
        path: "service_id",
        select: "service_name provider_id",
      });

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Verify that the appointment belongs to the user
    if (appointment.pet_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only cancel your own appointments",
      });
    }

    // Check if appointment can be cancelled (only pending or confirmed appointments)
    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Cannot cancel a completed appointment",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "This appointment is already cancelled",
      });
    }

    // Update appointment status to cancelled
    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment: appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
};
