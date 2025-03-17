import express from "express";
import { createScheduling } from "../../controller/Booking_Scheduling/boardingController.js";
import { 
    createGroomingScheduling, 
    getAllGroomingSchedulings, 
    getGroomingSchedulingById, 
    updateGroomingSheduling, 
    deleteGroomingScheduling 
} from "../../controller/Booking_Scheduling/groomingController.js";

const router = express.Router(); 

router.post("/bordingschedule", createScheduling);




router.post("/groomingschedule/create", createGroomingScheduling);            // Schedule a grooming appointment
router.get("/groomingschedule", getAllGroomingSchedulings);            // View all grooming appointments
router.get("/groomingschedule:id", getGroomingSchedulingById);         // View a specific appointment
router.put("/groomingschedule/update/:id", updateGroomingSheduling);          // Update an appointment
router.delete("/groomingschedule/delete/:id", deleteGroomingScheduling);     

export default router; 
