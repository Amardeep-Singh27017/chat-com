import mongoose from "mongoose";

// conversation cluster 
const conversationSchema = mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
           default: []
        }
    ]
}, { timestamps: true })

export default mongoose.model("Conversation", conversationSchema);
