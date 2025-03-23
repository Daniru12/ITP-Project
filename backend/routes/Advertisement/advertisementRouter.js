import express from "express";
import {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
} from "../../controller/Advertisement/advertisementController.js"

import { protect } from '../../middleware/authMiddleware.js';


const router = express.Router();

router.post("/create",protect,createAdvertisement);//Create a new advertisement
router.get("/",protect,getAdvertisements);//Get all advertisements
router.get("/:id",protect, getAdvertisementById);// Get a single advertisement by ID
router.put("/update/:id",protect, updateAdvertisement);//Update an advertisement
router.delete("/delete/:id",protect, deleteAdvertisement);//Delete an advertisement

export default router;
