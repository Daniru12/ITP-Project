import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Ordered products is required"],
      },
    ],
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    total_price: {
      type: Number,
      required: [true, "Total price is required"],
    },
    order_status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    pet_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "petowner is required"],
    },
    shipping_details: {
      address: { type: String, required: [true, "Shipping address is required"] },
      city: { type: String, required: [true, "City is required"] },
      postalCode: { type: String, required: [true, "Postal code is required"] },
      country: { type: String, required: [true, "Country is required"] },
    },
  },
  { timestamps: true } //it will automatically create fields for when the order was created and updated
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
