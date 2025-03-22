import TrainingSchedule from "../../models/BookingScheduling/TrainingSchedule.js";



// 1. Create Training Schedule
export const createTrainingSchedule = async (req, res) => {
    try {
        const { appointment_id,pet_id, service_id, week_start_date } = req.body;

        const defaultSchedule = [
            {
                day: "Monday",
                sessions: [
                    {
                        time: "06:00 AM",
                        training_type: "Basic Obedience",
                        duration: "1hour",
                        status: "Scheduled"
                    }
                ]
            },
            {
                day: "Wednesday",
                sessions: [
                    {
                        time: "07:00 AM",
                        training_type: "Agility Training",
                        duration: "1hour",
                        status: "Scheduled"
                    }
                ]
            },
            {
                day: "Friday",
                sessions: [
                    {
                        time: "06:00 AM",
                        training_type: "Leash Training",
                        duration: "1hour",
                        status: "Scheduled"
                    }
                ]
            },
        ];

        const newSchedule = new TrainingSchedule({
            appointment_id,
            pet_id,
            service_id,
            week_start_date,
            schedule: defaultSchedule
        });

        await newSchedule.save();
        res.status(201).json({ success: true, data: newSchedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Training Schedules
export const getAllTrainingSchedules = async (req, res) => {
    try {
        const schedules = await TrainingSchedule.find()
            .populate("pet_id", "name")
            .populate("service_id", "name");
        res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get Single Training Schedule by ID
export const getTrainingScheduleById = async (req, res) => {
    try {
        const schedule = await TrainingSchedule.findById(req.params.id)
            .populate("pet_id", "name")
            .populate("service_id", "name");

        if (!schedule) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        res.status(200).json({ success: true, data: schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Update Training Schedule
export const updateTrainingSchedule = async (req, res) => {
    try {
        const updated = await TrainingSchedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Delete Training Schedule
export const deleteTrainingSchedule = async (req, res) => {
    try {
        const deleted = await TrainingSchedule.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Schedule not found" });
        }

        res.status(200).json({ success: true, message: "Schedule deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
