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
            ref: "Employee",
            required: true,
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "ChatRoom",
            default: null,
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },
        // replyTo: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Message",
        //     default: null,
        // },
        // deliveredTo: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "Employee",
        //     },
        // ],
        // readBy: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "Employee",
        //     },
        // ],
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);