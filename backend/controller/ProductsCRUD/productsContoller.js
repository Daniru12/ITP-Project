import Product from "../../models/Products/Product.js";
import User from "../../models/User.js"; //User model for service providers

// Create Product 
export const createProduct = async (req, res) => {
  const {
    product_id,
    name,
    description,
    price,
    quantity,
    category,
    image,
    serviceProviderId,
    promo_code_applied,
  } = req.body;

  try {
    // Log the user role and serviceProviderId for debugging
    console.log("User Role:", req.user.user_type);
    console.log("Service Provider ID:", serviceProviderId);

    // Check if the user is a service provider or admin
    if (req.user.role !== "admin" && req.user.user_type !== "service_provider") {
      return res.status(403).json({ message: "Access denied. Only admins and service providers can create products." });
    }

    // Create a new product
    const newProduct = new Product({
      product_id,
      name,
      description,
      price,
      quantity,
      category,
      image,
      serviceProvider: req.user._id, //service providedr id logged
      promo_code_applied,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product created successfully!",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, unable to create product." });
  }
};