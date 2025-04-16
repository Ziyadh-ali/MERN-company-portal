import { Schema } from "mongoose";
import { IAttendanceModel } from "../models/AttendanceModel";

export const AttendanceSchema = new Schema<IAttendanceModel>({
    employeeId: {type : Schema.Types.ObjectId , ref : "Employee",  required : true},
    date: {type : Date , required : true, },
    checkInTime: {type : Date  , default : null},
    checkOutTime: {type : Date  , default : null},
    status: {
        type : String,
        enum : ["Present", "Absent", "Leave", "Holiday" , "Pending"],
        default : "Pending",
    },
});
