
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

const router = express.Router();

// Create a new advertisement
router.post("/create", createAdvertisement);

// Get all advertisements
router.get("/", getAdvertisements);

// Get only approved advertisements
router.get("/approved", getApprovedAdvertisements);

// Get a single advertisement by ID
router.get("/:id", getAdvertisementById);

// Update an advertisement
router.put("/update/:id", updateAdvertisement);

// Delete an advertisement
router.delete("/delete/:id", deleteAdvertisement);

// Approve an advertisement
router.put("/approve/:id", approveAdvertisement);

// Reject an advertisement
router.put("/reject/:id", rejectAdvertisement);

export default router;
