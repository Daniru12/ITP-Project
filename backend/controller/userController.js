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

export function loginUser(req, res) {
  const data = req.body;

  User.findOne({ email: data.email }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const isPasswordValid = bcrypt.compareSync(data.password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          user_type: user.user_type,
          profile_picture: user.profile_picture,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
          message: "Login successful",
          token: token,
          user: user,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    }
  });
}

export async function Profile(req, res) {

  //just for testing
  // if (req.user == null) {
  //   res.status(401).json({
  //     message: "Please login and try again"
  //   });
  //   return;
  // }
  // if(req.user.user_type != "admin"){
  //   res.status(403).json({
  //     message : "You are not authorized to perform this action"
  //   })
  //   return
  // }

  try {
    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      full_name: user.full_name, 
      email: user.email,
      phone_number: user.phone_number,
      user_type: user.user_type,
      profile_picture: user.profile_picture
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
}
