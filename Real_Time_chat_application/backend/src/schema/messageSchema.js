import { Schema } from "mongoose";

export const messageSchema = Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat"
    }
},
    {
        timestamps: true
    }
)