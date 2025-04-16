import { ObjectId } from "mongoose";

export interface Attendance {
    _id ?: string | ObjectId,
    employeeId : ObjectId | string,
    date : Date,
    checkInTime : Date | null,
    checkOutTime : Date | null,
    status : "Present" | "Absent" | "Late" | "Leave"| "Pending",
}