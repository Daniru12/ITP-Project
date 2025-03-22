import express from "express";
import { createScheduling } from "../../controller/Booking_Scheduling/boardingController.js";
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

const router = express.Router(); 

router.post("/bordingschedule", createScheduling);




router.post("/groomingschedule/create", createGroomingScheduling);            // Schedule a grooming appointment
router.get("/groomingschedule", getAllGroomingSchedulings);            // View all grooming appointments
router.get("/groomingschedule/:id", getGroomingSchedulingById);         // View a specific appointment
router.put("/groomingschedule/update/:id", updateGroomingSheduling);          // Update an appointment
router.delete("/groomingschedule/delete/:id", deleteGroomingScheduling);   


//Training Scheduling Routes
router.post("/trainigschedule/create", createTrainingSchedule);
router.get("/trainigschedule", getAllTrainingSchedules);
router.get("/trainigschedule/:id", getTrainingScheduleById);
router.put("/trainigschedule/update/:id", updateTrainingSchedule);
router.delete("/trainigschedule/delete/:id", deleteTrainingSchedule);

export default router; 
