import GroomingService from "../../models/Service.js";

// Add a new grooming service
export const addService = async (req, res) => {
  try {
    // Check if user is a service provider
    if (req.user.user_type !== "service_provider") {
      return res.status(403).json({
        message: "Only service providers can add services",
      });
    }

    const { service_name, description, packages, location, image } = req.body;

    // Check if location is provided
    if (!location) {
      return res.status(400).json({
        message: "Location is required",
      });
    }

    // Validate image URL if provided
    // if (image && !isValidUrl(image)) {
    //   return res.status(400).json({
    //     message: "Invalid image URL format",
    //   });
    // }

    // Validate that all three package tiers are provided
    const requiredTiers = ["basic", "premium", "luxury"];
    const missingTiers = requiredTiers.filter((tier) => !packages[tier]);

    if (missingTiers.length > 0) {
      return res.status(400).json({
        message: `Please provide details for all package types: ${missingTiers.join(", ")}. Each service must have basic, premium, and luxury packages.`,
      });
    }

    // Validate each package tier
    for (const tier of requiredTiers) {
      const package_tier = packages[tier];

      // Check for required fields
      if (
        !package_tier.price ||
        !package_tier.duration ||
        !package_tier.includes
      ) {
        return res.status(400).json({
          message: `Missing required fields in ${tier} package`,
          required: ["price", "duration", "includes"],
        });
      }

      // Validate duration minimum
      if (package_tier.duration < 15) {
        return res.status(400).json({
          message: `${tier} package duration must be at least 15 minutes`,
        });
      }

      // Validate price is not negative
      if (package_tier.price < 0) {
        return res.status(400).json({
          message: `${tier} package price cannot be negative`,
        });
      }

      // Validate includes array
      if (
        !Array.isArray(package_tier.includes) ||
        package_tier.includes.length === 0
      ) {
        return res.status(400).json({
          message: `${tier} package must include at least one service`,
        });
      }

      // Add tier type to each package
      package_tier.type = tier;
    }

    // Create new service
    const serviceData = {
      provider_id: req.user._id,
      service_name,
      service_category: "pet_grooming",
      description,
      packages,
      location,
      is_available: true,
      image: image || "https://via.placeholder.com/150", // Use provided image or default
    };

    const newService = new GroomingService(serviceData);
    await newService.save();

    res.status(201).json({
      message: "Your grooming service has been created successfully!",
      service: newService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Sorry, we couldn't save your grooming service",
      error: error.message,
    });
  }
};

// Helper function to validate URL
// const isValidUrl = (string) => {
//   try {
//     new URL(string);
//     return true;
//   } catch (_) {
//     return false;
//   }
// };

// Get provider's services
export const getProviderServices = async (req, res) => {
  try {
    // Check if user is a service provider
    if (req.user.user_type !== "service_provider") {
      return res.status(403).json({
        message:
          "Access denied. Only service providers can view their services.",
      });
    }

    const services = await GroomingService.find({
      provider_id: req.user._id,
    });

    if (services.length === 0) {
      return res.status(200).json({
        message: "You haven't created any grooming services yet",
        services: [],
      });
    }

    res.status(200).json({
      message: "Here are your grooming services",
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching your services",
      error: error.message,
    });
  }
};



// Get services by category
export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await GroomingService.find({
      service_category: category,
      is_available: true,
    }).populate("provider_id", "username full_name phone_number");

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching services by category",
      error: error.message,
    });
  }
};