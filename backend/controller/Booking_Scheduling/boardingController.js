import Scheduling from "../../models/BookingScheduling/BoardingSheduling.js";
import Appointment from "../../models/BookingScheduling/Appointment.js";


// CREATE - Automatically called after confirming an appointment
export const createScheduling = async (req, res) => {
    try {
      const { pet_id, service_id, appointment_id, duration, start_time, end_time } = req.body;
  
      // Basic validation
      if (!pet_id || !service_id || !appointment_id || !start_time) {
        return res.status(400).json({ error: "All fields are required!" });
      }
  
      // Check if appointment exists
      const appointment = await Appointment.findById(appointment_id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
  
      // Prevent duplicate scheduling
      const existing = await Scheduling.findOne({ appointment_id });
      if (existing) {
        return res.status(400).json({ error: "Scheduling already exists for this appointment" });
      }
  
      // Create scheduling
      const newScheduling = new Scheduling({
        pet_id,
        service_id,
        appointment_id,
        duration,
        start_time,
        end_time, // Optional, used only if duration is "custom"
      });
  
      await newScheduling.save();
  
      res.status(201).json({
        message: "Boarding schedule created successfully!",
        data: newScheduling,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  };

// GET ALL SCHEDULINGS
export const getAllSchedulings = async (req, res) => {
  try {
    const schedulings = await Scheduling.find()
      .populate({
        path: "pet_id",
        populate: {
          path: "owner_id",
          select: "full_name phone_number"
        }
    })
      .populate("service_id")
      .populate("appointment_id");

    res.status(200).json(schedulings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schedulings", details: error.message });
  }
};

// GET SINGLE SCHEDULING BY ID
export const getSchedulingById = async (req, res) => {
  try {
    const scheduling = await Scheduling.findById(req.params.id)
      .populate("pet_id")
      .populate("service_id")
      .populate("appointment_id");

    if (!scheduling) {
      return res.status(404).json({ error: "Scheduling not found" });
    }

    res.status(200).json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving scheduling", details: error.message });
  }
};

// UPDATE SCHEDULING
export const updateScheduling = async (req, res) => {
  try {
    const updatedScheduling = await Scheduling.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedScheduling) {
      return res.status(404).json({ error: "Scheduling not found" });
    }

    res.status(200).json({
      message: "Scheduling updated successfully!",
      data: updatedScheduling,
    });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

// DELETE SCHEDULING
export const deleteScheduling = async (req, res) => {
  try {
    const deletedScheduling = await Scheduling.findByIdAndDelete(req.params.id);

    if (!deletedScheduling) {
      return res.status(404).json({ error: "Scheduling not found" });
    }

    res.status(200).json({ message: "Scheduling deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed", details: error.message });
  }
};

// TOGGLE CONFIRMATION FOR A SPECIFIC DAY
export const toggleConfirmedDay = async (req, res) => {
    try {
      const { scheduleId } = req.params;
      const { date } = req.body;
  
      if (!date) {
        return res.status(400).json({ error: "Date is required" });
      }
  
      const schedule = await Scheduling.findById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }
  
      // Initialize if empty
      if (!Array.isArray(schedule.confirmed_days)) {
        schedule.confirmed_days = [];
      }
  
      // Toggle the date
      if (schedule.confirmed_days.includes(date)) {
        schedule.confirmed_days = schedule.confirmed_days.filter(d => d !== date);
      } else {
        schedule.confirmed_days.push(date);
      }
  
      await schedule.save();
  
      res.status(200).json({
        message: "Confirmed days updated",
        confirmed_days: schedule.confirmed_days,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to toggle confirmed day",
        details: error.message,
      });
    }
  };
  