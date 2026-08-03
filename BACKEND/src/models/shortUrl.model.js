import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
    {
        full_url: {
            type: String,
            required: true,
            trim: true,
        },
        short_url: {
            type: String,
            required: true,
            index: true,
            unique: true,
            trim: true,
        },
        clicks: {
            type: Number,
            required: true,
            default: 0,
        },
        click_events: {
            type: [Date],
            default: [],
        },
        last_accessed_at: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);
export default shortUrl;