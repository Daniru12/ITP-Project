import mongoose from "mongoose";

const advertiseSchema = new mongoose.Schema(
    {
        ad_id : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },
        ad_image : {
            type: String,
            default: "https://via.placeholder.com/150", // Default image
        },
        ad_description : {
            type: String,
            required : [true,"Description is required"]
        },
        ad_title : {
            type: String,
            required : true
        }

    }
)