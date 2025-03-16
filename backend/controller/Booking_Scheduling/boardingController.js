import Scheduling from "../../models/BookingScheduling/BoardingSheduling.js"; 


export const createScheduling = async (req, res) => {
    try {
        const { pet_id, service_id, appointment_id, duration, start_time } = req.body;

        if (!pet_id || !service_id || !appointment_id || !start_time) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Calculate `end_time` before saving
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
                endTime = req.body.end_time || endTime; // Use custom `end_time` if provided
                break;
        }

        // Save the scheduling with `end_time`
        const newScheduling = new Scheduling({
            pet_id,
            service_id,
            appointment_id,
            duration,
            start_time,
            end_time: endTime, // Now `end_time` is set before saving
        });

        await newScheduling.save();

        res.status(201).json({
            message: "Pet scheduling created successfully!",
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};