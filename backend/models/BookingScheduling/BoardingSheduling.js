import mongoose from "mongoose";

const SchedulingSchema = new mongoose.Schema(
    {
        pet_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: [true, "Pet is required"],
        },
        
        service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Services",
            required: [true, "Service is required"],
        },
        appointment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appoiment",
            required: [true, "appoiment is required"],
          },
        duration : {
            type: String,
            enum: ["overnight", "weekday", "weekend", "day", "custom"],
            default: "day",
        },
        start_time: {
            type: Date,
            required: [true, "Start time is required"],
        },
        end_time: {
            type: Date
        },
        status: {
            type: String,
            enum: ["Scheduled", "In Progress", "Completed", "Canceled"],
            default: "Scheduled",
        }
    }
)


// Middleware to **automatically calculate end_time** based on duration
SchedulingSchema.pre("save", function (next) {
    if (this.start_time) {
        let endTime = new Date(this.start_time);
        switch (this.duration) {
            case "overnight":
                endTime.setHours(endTime.getHours() + 12); // 12-hour stay
                break;
            case "weekday":
                endTime.setDate(endTime.getDate() + 5); // Monday-Friday
                break;
            case "weekend":
                endTime.setDate(endTime.getDate() + 2); // Saturday-Sunday
                break;
            case "day":
                endTime.setHours(endTime.getHours() + 8); // Full-day daycare (8 hours)
                break;
            default:
                endTime = this.end_time; // Custom user-defined end_time
                break;
        }
        this.end_time = endTime;
    }
    next();
});

const Scheduling = mongoose.model("Boarding", SchedulingSchema);

export default Scheduling;