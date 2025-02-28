import express from "express";
import { loginUser, Profile, registerUser, registerPet, getPets, getLoyaltyPoints } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/profile",protect,Profile);
userRouter.post("/pet", protect, registerPet);
userRouter.get("/pets", protect, getPets);
userRouter.get("/loyalty-points", protect, getLoyaltyPoints);

export default userRouter;
