import express from "express";
import {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
} from "../../controller/Advertisement/advertisementController.js"


const router = express.Router();

router.post("/create", createAdvertisement);//Create a new advertisement
router.get("/", getAdvertisements);//Get all advertisements
router.get("/:id", getAdvertisementById);// Get a single advertisement by ID
router.put("/update/:id", updateAdvertisement);//Update an advertisement
router.delete("/delete/:id", deleteAdvertisement);//Delete an advertisement

export default router;
