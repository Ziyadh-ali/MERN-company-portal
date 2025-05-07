import { Schema } from "mongoose";
import { INotificationModel } from "../models/NotificationModel";

export const NotificationSchema = new Schema<INotificationModel>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'Employee'
        },
        type: {
            type: String,
            required: true,
            enum: ['message', 'group_invite', 'mention', 'reaction', 'group_update']
        },
        content: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

NotificationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});