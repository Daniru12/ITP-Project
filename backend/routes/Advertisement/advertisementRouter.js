
import express from "express";
import {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  approveAdvertisement,
  rejectAdvertisement,
  getApprovedAdvertisements,
} from "../../controller/Advertisement/advertisementController.js"; // Adjust path as needed

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Create a new advertisement
router.post("/create",protect, createAdvertisement);

// Get all advertisements
router.get("/", getAdvertisements);

// Get only approved advertisements
router.get("/approved", getApprovedAdvertisements);

// Get a single advertisement by ID
router.get("/:id",protect, getAdvertisementById);

// Update an advertisement
router.put("/update/:id",protect, updateAdvertisement);

// Delete an advertisement
router.delete("/delete/:id",protect, deleteAdvertisement);

// Approve an advertisement
router.put("/approve/:id",protect, approveAdvertisement);

// Reject an advertisement
router.put("/reject/:id",protect, rejectAdvertisement);

export default router;
