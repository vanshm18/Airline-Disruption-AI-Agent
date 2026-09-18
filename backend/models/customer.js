import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    loyaltyTier: {
        type: String,
        enum: ["Silver", "Gold", "Platinum"],
        required: true,
    },

    bookingReference: {
        type: String,
        required: true,
        unique: true,
    },

    contact: {
        email: {
            type: String,
            required: true,
            unique:true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        }
    },

    travelHistory: {
        flightsLast12Months: Number,
        priorComplaints: Number,
        complaintDetails: String,
    },
},
{
    timestamps: true,
});

export default mongoose.model("Customer", customerSchema);