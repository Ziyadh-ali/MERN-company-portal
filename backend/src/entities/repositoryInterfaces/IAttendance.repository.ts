import { Attendance } from "../models/Attendance.entities";

export interface IAttendanceRepository {
    createAttendance (employeeId : string , date : Date) : Promise<Attendance>;
    markCheckIn (employeeId: string, time: Date,startOfDay : Date, endOfDay : Date) : Promise<Attendance>;
    markCheckOut (
        employeeId: string, 
        time: Date,
        startOfDay : Date, 
        endOfDay : Date ,
    ) : Promise<Attendance>;
    getAttendanceByMonth (employeeId : string , year : number , month : number) : Promise<Attendance[] | []>;
    updateStatus (id : string , status : "Present" | "Absent" | "Late" | "Leave"| "Pending") : Promise<Attendance | null>;
    getAttendanceByDate(employeeId: string, date: Date): Promise<Attendance | null>;
}