import Appointment from "../../models/Appointment.js";
import Pet from "../../models/Pets.js";
import GroomingService from "../../models/GroomingService.js";

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

    const newAppointment = new Appointment({
      ...req.body,
      status: "pending",
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
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
    // Step 1: Make sure the user is a service provider
    const isServiceProvider = req.user.user_type === "service_provider";
    if (!isServiceProvider) {
      return res.status(403).json({
        message:
          "You need to be a service provider to accept/reject appointments",
      });
    }

    // Step 2: Get the appointment ID and new status from the request
    const appointmentId = req.params.id;
    const newStatus = req.body.status;

    // Step 3: Make sure the new status is either 'confirmed' or 'rejected'
    if (newStatus !== "confirmed" && newStatus !== "rejected") {
      return res.status(400).json({
        message: "Please choose either 'confirmed' or 'rejected' as the status",
      });
    }

    // Step 4: Find the appointment in our database
    const appointment = await Appointment.findById(appointmentId).populate({
      path: "service_id",
      select: "provider_id service_name",
    });

    // Step 5: Check if we found the appointment
    if (!appointment) {
      return res.status(404).json({
        message: "We couldn't find this appointment",
      });
    }

    // Step 6: Make sure the appointment belongs to this service provider
    const isProviderAppointment =
      appointment.service_id.provider_id.toString() === req.user._id.toString();
    if (!isProviderAppointment) {
      return res.status(403).json({
        message: "This appointment doesn't belong to your services",
      });
    }

    // Step 7: Make sure the appointment is still 'pending'
    if (appointment.status !== "pending") {
      return res.status(400).json({
        message: `This appointment is already ${appointment.status}`,
      });
    }

    // Step 8: Update the appointment status
    appointment.status = newStatus;
    await appointment.save();

    // Step 9: Send back success message
    res.status(200).json({
      message: `Great! The appointment has been ${newStatus}`,
      appointment: appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating the appointment",
      error: error.message,
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
