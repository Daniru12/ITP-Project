import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getProviderAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  cancelAppointment,
} from "../../controller/Booking_Scheduling/appointmentController.js";
import { protect } from "../../middleware/authMiddleware.js";

const appointmentRouter = express.Router();

// All appointment routes are protected
appointmentRouter.post("/create", protect, bookAppointment);
appointmentRouter.get("/user", protect, getUserAppointments);
appointmentRouter.get("/provider", protect, getProviderAppointments);

// New routes for managing appointments
appointmentRouter.patch("/:id/status", protect, updateAppointmentStatus);
appointmentRouter.delete("/:id", protect, deleteAppointment);
appointmentRouter.patch("/:id/cancel", protect, cancelAppointment);

export default appointmentRouter;
