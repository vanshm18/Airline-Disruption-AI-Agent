import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },

    pnr: {
        type: String,
        required: true,
        index: true,
    },

    flight: {
        type: String,
        required: true,
    },

    route: {
        type: String,
        required: true,
    },

    date: {
        type: String,
        required: true,
    },

    scheduledDeparture: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["Cancelled", "Delayed", "Unaffected"],
        required: true,
    },

    reason: {
        type: String,
    },

    delayHours: {
        type: Number,
    },

    returnFlight: {
        flight: String,
        route: String,
        date: String,
        scheduledDeparture: String,
        status: {
            type: String,
            enum: ["Cancelled", "Delayed", "Unaffected"],
        },
        delayHours: Number,
        newDeparture: String,
    },
},

{
    timestamps: true,
});

export default mongoose.model("Booking", bookingSchema);
