import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function registerUser(req, res) {
    const data = req.body;
  
    // Hash the password before saving the user
    data.password = bcrypt.hashSync(data.password, 8);
  
    const newUser = new User(data);
  
    newUser
      .save()
      .then(() => {
        res.status(200).json({ message: "User created successfully" });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
      });
  }
  
