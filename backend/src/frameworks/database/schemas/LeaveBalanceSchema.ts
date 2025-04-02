import { Schema } from "mongoose";
import { ILeaveBalance } from "../models/user/LeaveBalanceModel";

export const LeaveBalanceSchema = new Schema<ILeaveBalance>(
    {
        userId: { type: String, required: true, unique: true },
        leaveBalances: [
            {
                leaveTypeId: { type: String, required: true },
                availableDays: { type: Number, required: true },
                usedDays: { type: Number, default: 0 },
                totalDays : {type : Number ,  required : true}
            },
        ],
    }
);