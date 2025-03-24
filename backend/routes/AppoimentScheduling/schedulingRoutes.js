import express from "express";

import { 
    createGroomingScheduling, 
    getAllGroomingSchedulings, 
    getGroomingSchedulingById, 
    updateGroomingSheduling, 
    deleteGroomingScheduling 
} from "../../controller/Booking_Scheduling/groomingController.js";

import {
    createTrainingSchedule,
    getAllTrainingSchedules,
    getTrainingScheduleById,
    updateTrainingSchedule,
    deleteTrainingSchedule
} from "../../controller/Booking_Scheduling/trainingController.js";

import {
    createScheduling,
    getAllSchedulings,
    getSchedulingById,
    updateScheduling,
    deleteScheduling,
    toggleConfirmedDay 
  } from "../../controller/Booking_Scheduling/boardingController.js";

const router = express.Router(); 

import { protect } from "../../middleware/authMiddleware.js";




router.post("/groomingschedule/create",protect, createGroomingScheduling);            // Schedule a grooming appointment
router.get("/groomingschedule",protect, getAllGroomingSchedulings);            // View all grooming appointments
router.get("/groomingschedule/:id",protect, getGroomingSchedulingById);         // View a specific appointment
router.put("/groomingschedule/update/:id",protect, updateGroomingSheduling);          // Update an appointment
router.delete("/groomingschedule/delete/:id",protect, deleteGroomingScheduling);   


//Training Scheduling Routes
router.post("/trainigschedule/create", createTrainingSchedule);
router.get("/trainigschedule", getAllTrainingSchedules);
router.get("/trainigschedule/:id", getTrainingScheduleById);
router.put("/trainigschedule/update/:id", updateTrainingSchedule);
router.delete("/trainigschedule/delete/:id", deleteTrainingSchedule);






// All boarding schedule routes are protected
router.post("/bordingschedule/create", protect, createScheduling); // Create new boarding schedule
router.get("/bordingschedule", protect, getAllSchedulings);       // Get all boarding schedules
router.get("/bordingschedule/:id", protect, getSchedulingById);    // Get single schedule by ID
router.put("/bordingschedule/update/:id", protect, updateScheduling);     // Update a schedule by ID
router.delete("/bordingschedule/delete/:id", protect, deleteScheduling);  // Delete a schedule by ID
router.patch("/bordingschedule/toggle/:scheduleId", toggleConfirmedDay);


export default router; 
