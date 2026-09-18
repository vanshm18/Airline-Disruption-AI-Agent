import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
},
{
    timestamps: true,
});

const conversationSchema = new mongoose.Schema({
    bookingReference: {
        type: String,
        required: true,
        index: true,
    },

    messages: [messageSchema],

    latestDecision: mongoose.Schema.Types.Mixed,
},
{
    timestamps: true,
});

export default mongoose.model("Conversation", conversationSchema);