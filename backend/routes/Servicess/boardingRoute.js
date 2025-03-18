import express from "express";
import { addBoardingService } from "../../controller/Servicess/boardingController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addBoardingService", protect, addBoardingService);

export default router;
