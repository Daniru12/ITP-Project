// controllers/trainingScheduleController.js
import TrainingSchedule from '../../models/BookingScheduling/TrainingSchedule.js';




export const createTrainingSchedule = async (req, res) => {
  try {
    

    const {
      appointment_id,
      pet_id,
      service_id,
      week_start_date,
      schedule,
    } = req.body;

    // Basic validation (before passing to Mongoose)
    if (!appointment_id || !pet_id || !service_id || !week_start_date || !schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or invalid schedule format",
      });
    }

    const newSchedule = new TrainingSchedule({
      appointment_id,
      pet_id,
      service_id,
      week_start_date,
      schedule,
      comments: req.body.comments || "", // Optional
    });

    await newSchedule.save();

    res.status(201).json({
      success: true,
      message: "Training schedule created successfully",
      data: newSchedule,
    });

  } catch (err) {
   

    // If it's a Mongoose validation error, return 400 instead of 500
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};



export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await TrainingSchedule.find()
      .populate('appointment_id')
      .populate('pet_id')
      .populate('service_id');
    res.status(200).json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await TrainingSchedule.findById(req.params.id)
      .populate('appointment_id')
      .populate('pet_id')
      .populate('service_id');
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updated = await TrainingSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    await TrainingSchedule.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
