import { Attendance } from "../models/Attendance.entities";

export interface IAttendanceUseCase {
    checkIn(employeeId : string) : Promise<void>;
    checkOut(employeeId : string) : Promise<void>;
    getTodayAttendance (employeeId : string) : Promise<Attendance | null>;
    getAttendanceByMonth (employeeId : string , year : number , month : number) : Promise<Attendance[] | []>;
}