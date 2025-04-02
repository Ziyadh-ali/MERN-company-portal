import { Schema } from "mongoose";
import { ILeaveType } from "../models/user/LeaveTypeModel";

export const LeaveTypeSchema = new Schema<ILeaveType>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        maxDaysAllowed: { type: Number, required: true },
        isPaid: { type: Boolean, default: true },
        requiresApproval: { type: Boolean, default: true },
    }
);