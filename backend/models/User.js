const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'], // Exclude password from query results by default
    },
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    phone_number: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    user_type: {
      type: String,
      enum: ['pet_owner', 'service_provider', 'admin'],
      required: [true, 'User type is required'],
    },
    profile_picture: {
      type: String,
      default: 'https://via.placeholder.com/150', // Default profile picture
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;