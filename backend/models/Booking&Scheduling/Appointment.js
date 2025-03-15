import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    pet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: [true, "Pet is required"],
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroomingService",
      required: [true, "Service is required"],
    },
    appointment_date: {
      type: Date,
      required: [true, "Appointment date is required"],
      unique : true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    phone: {
      type : String,
      required: [true, "Phone number is required"]
    },
    petype:{
      type : String,
      squard: ["cat", "dog", "parrot", "rabit"],
      default: "dog",
    },
    age : {
      type : Number
    },
    weight : {
      type : String
    },
    special_notes: {
      type: String,
      default: "",
    },
    package_type: {
      type: String,
      enum: ["basic", "premium", "luxury"],
      required: [true, "Package type is required"]
    },
    discount_applied: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
