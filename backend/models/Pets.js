const mongoose = require('mongoose');

// Define the Pet Schema
const petSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User', // Links to the User model
      required: [true, 'Owner ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Pet name is required'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      required: [true, 'Gender is required'],
    },
    pet_image: {
      type: String,
      default: 'https://via.placeholder.com/150', // Default image
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Pet model
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;