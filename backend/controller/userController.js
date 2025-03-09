import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Pet from "../models/Pets.js";

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
        const token = jwt.sign(
          {
            _id: user._id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            user_type: user.user_type,
            profile_picture: user.profile_picture,
            loyalty_points: user.loyalty_points,
            
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

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
      profile_picture: user.profile_picture,
      loyalty_points: user.loyalty_points
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
}

export const registerPet = async (req, res) => {
  if (req.user == null) {
    res.status(401).json({
      message: "Please login and try again",
    });
    return;
  }

  if (req.user.user_type !== "pet_owner") {
    res.status(403).json({
      message: "Only pet owners can register pets",
    });
    return;
  }

  try {
    const petData = {
      owner_id: req.user._id,
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      age: req.body.age,
      gender: req.body.gender,
      pet_image: req.body.pet_image || "https://via.placeholder.com/150",
    };

    const newPet = new Pet(petData);
    await newPet.save();

    res.status(201).json({
      message: "Pet registered successfully",
      pet: newPet,
    });
  } catch (error) {
    console.error("Error registering pet:", error);
    res.status(500).json({
      message: "Error registering pet",
      error: error.message,
    });
  }
};

export const getPets = async (req, res) => {
  if (req.user == null) {
    res.status(401).json({
      message: "Please login and try again",
    });
    return;
  }

  try {
    const pets = await Pet.find({ owner_id: req.user._id });
    res.status(200).json({
      message: "Pets fetched successfully",
      pets: pets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pets", 
      error: error.message,
    });
  }
};

export const getLoyaltyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const possibleDiscount = calculateDiscount(user.loyalty_points);

    res.status(200).json({
      points: user.loyalty_points,
      possibleDiscount: possibleDiscount
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching loyalty points",
      error: error.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  if(req.user.user_type !== "admin"){
    res.status(403).json({
      message: "You are not authorized to perform this action"
    })
    return
  }else{
    const users = await User.find()
    res.status(200).json({
      message: "Users fetched successfully",
      users: users
    })
  }
  
}
