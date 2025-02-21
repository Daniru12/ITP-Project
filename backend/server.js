import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import groomingRouter from "./routes/GroomingRoutes/groomingRouter.js";
import appointmentRouter from "./routes/GroomingRoutes/appointmentRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error("Mongo URL not set in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use("/api/users", userRouter);
app.use("/api/grooming", groomingRouter);
app.use("/api/appointments", appointmentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
