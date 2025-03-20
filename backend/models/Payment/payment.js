import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment reference is required"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    pet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: [true, "Pet is required"],
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: [true, "Service is required"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    payment_method: {
      type: String,
      enum: ["Cash", "Card"],
      required: [true, "Payment method is required"],
    },
    card_details: {
      card_number: {
        type: String,
        required: function () {
          return this.payment_method === "Card";
        },
      },
      card_holder_name: {
        type: String,
        required: function () {
          return this.payment_method === "Card";
        },
      },
      expiration_date: {
        type: String,
        required: function () {
          return this.payment_method === "Card";
        },
      },
      cvv: {
        type: String,
        required: function () {
          return this.payment_method === "Card";
        },
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    transaction_id: {
      type: String,
      unique: true,
      required: function () {
        return this.status === "Completed";
      },
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

