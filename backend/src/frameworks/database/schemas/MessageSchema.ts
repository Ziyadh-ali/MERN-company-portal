import { Schema } from "mongoose";
import { IMessageModel } from "../models/MessageModel";

export const MessageSchema = new Schema<IMessageModel>(
    {
        content: {
            type: String,
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "ChatRoom",
            default: null,
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
        deliveredTo: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        readBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);