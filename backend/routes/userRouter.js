import express from "express";
import { loginUser, Profile, registerUser, registerPet, getPets, getLoyaltyPoints, getAllUsers, getAllServices, getAllPets, deletePet, getServicesForDisplay, getServiceById } from "../controller/userController.js";
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
userRouter.get("/services-for-display", protect, getServicesForDisplay);
userRouter.get("/service/:id", protect, getServiceById);

export default userRouter;
