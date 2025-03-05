import GroomingService from "../../models/Service.js";

// Add a new boarding service
export const addBoardingService = async (req, res) => {
    try {
        // Check if user is a service provider
        if (req.user.user_type !== "service_provider") {
            return res.status(403).json({
                message: "Only service providers can add services",
            });
        }

        const { service_name, description, packages } = req.body;

        // Validate required fields
        if (!service_name || !description) {
            return res.status(400).json({
                message: "Service name, description, and packages are required",
            });
        }

        const boardingService = new GroomingService({
            provider_id: req.user._id,
            service_name,
            service_category: "pet_boarding",
            description,
            packages,
            is_available: true
        });

        await boardingService.save();

        res.status(201).json({
            message: "Boarding service added successfully",
            service: boardingService,
        });
    } catch (error) {
        console.error("Error adding boarding service:", error);
        res.status(500).json({
            message: "Error adding boarding service",
            error: error.message
        });
    }
}
