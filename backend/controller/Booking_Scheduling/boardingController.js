import Scheduling from "../../models/BookingScheduling/BoardingSheduling.js";

// CREATE
export const createScheduling = async (req, res) => {
    try {
        const { pet_id, service_id, appointment_id, duration, start_time } = req.body;

        if (!pet_id || !service_id || !appointment_id || !start_time) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Calculate end_time
        let endTime = new Date(start_time);
        switch (duration) {
            case "overnight":
                endTime.setHours(endTime.getHours() + 12);
                break;
            case "weekday":
                endTime.setDate(endTime.getDate() + 5);
                break;
            case "weekend":
                endTime.setDate(endTime.getDate() + 2);
                break;
            case "day":
                endTime.setHours(endTime.getHours() + 8);
                break;
            default:
                endTime = req.body.end_time || endTime;
                break;
        }

        const newScheduling = new Scheduling({
            pet_id,
            service_id,
            appointment_id,
            duration,
            start_time,
            end_time: endTime,
        });

        await newScheduling.save();

        res.status(201).json({
            message: "Pet scheduling created successfully!",
            data: newScheduling,
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// GET ALL
export const getAllSchedulings = async (req, res) => {
    try {
        const schedulings = await Scheduling.find()
            .populate("pet_id")
            .populate("service_id")
            .populate("appointment_id");

        res.status(200).json(schedulings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch schedulings", details: error.message });
    }
};

// GET ONE
export const getSchedulingById = async (req, res) => {
    try {
        const scheduling = await Scheduling.findById(req.params.id)
            .populate("pet_id")
            .populate("service_id")
            .populate("appointment_id");

        if (!scheduling) {
            return res.status(404).json({ error: "Scheduling not found" });
        }

        res.status(200).json(scheduling);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving scheduling", details: error.message });
    }
};

// UPDATE
export const updateScheduling = async (req, res) => {
    try {
        const updatedScheduling = await Scheduling.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedScheduling) {
            return res.status(404).json({ error: "Scheduling not found" });
        }

        res.status(200).json({
            message: "Scheduling updated successfully!",
            data: updatedScheduling,
        });
    } catch (error) {
        res.status(500).json({ error: "Update failed", details: error.message });
    }
};

// DELETE
export const deleteScheduling = async (req, res) => {
    try {
        const deletedScheduling = await Scheduling.findByIdAndDelete(req.params.id);

        if (!deletedScheduling) {
            return res.status(404).json({ error: "Scheduling not found" });
        }

        res.status(200).json({ message: "Scheduling deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed", details: error.message });
    }
};
