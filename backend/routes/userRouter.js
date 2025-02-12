import express from "express";
import { loginUser, registerUser } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login",loginUser);

export default userRouter;
