import express from "express";
import { loginUser, Profile, registerUser, registerPet, getPets, getLoyaltyPoints, getAllUsers, getAllServices, getAllPets, deletePet, getServicesForDisplay, getServiceById, deleteService, adminDeleteService, adminDeletePet, getPetById, updatePet } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/profile",protect,Profile);
userRouter.post("/pet", protect, registerPet);
userRouter.get("/pets", protect, getPets);
userRouter.get("/loyalty-points", protect, getLoyaltyPoints);
userRouter.get("/all-users", protect, getAllUsers);
userRouter.get("/services", protect,getAllServices);
userRouter.get("/allpets",protect, getAllPets);
userRouter.delete("/deletePet/:id",protect, deletePet);
userRouter.get("/services-for-display",getServicesForDisplay);
userRouter.get("/service/:id",getServiceById);
userRouter.delete("/service/:id", protect, deleteService);
userRouter.delete("/admin-delete-service/:id", protect, adminDeleteService);
userRouter.delete("/admin-delete-pet/:id", protect, adminDeletePet);
userRouter.get("/pet/:id", protect, getPetById);
userRouter.put("/pet/:id", protect, updatePet);

export default userRouter;
