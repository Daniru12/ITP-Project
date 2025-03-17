import express from "express";
import { createScheduling } from "../../controller/Booking_Scheduling/boardingController.js";

const router = express.Router(); 

router.post("/bordingschedule", createScheduling);

export default router; 
