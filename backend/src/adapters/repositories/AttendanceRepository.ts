import { injectable, inject } from "tsyringe";
import { IAttendanceRepository } from "../../entities/repositoryInterfaces/IAttendance.repository";
import { Attendance } from "../../entities/models/Attendance.entities";
import { attendanceModel } from "../../frameworks/database/models/AttendanceModel";

@injectable()
export class AttendanceRepository implements IAttendanceRepository {
    async createAttendance(employeeId: string, date: Date): Promise<Attendance> {
        return await attendanceModel.create({
            employeeId,
            date,
        });
    }

    async getAttendanceByDate(employeeId: string, date: Date): Promise<Attendance | null> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await attendanceModel.findOne({
            employeeId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
    }

    async getAttendanceByMonth(employeeId: string, year: number, month: number): Promise<Attendance[] | []> {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
            throw new Error("Invalid start or end date");
        }

        return await attendanceModel.find({
            employeeId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        }).sort({ date: 1 });
    }

    async markCheckIn(employeeId: string, time: Date, startOfDay: Date, endOfDay: Date): Promise<Attendance> {
        let attendance = await attendanceModel.findOne({
            employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            }
        });

        if (!attendance) {
            attendance = await attendanceModel.create({ employeeId, date: new Date() })
        }

        attendance.checkInTime = time
        return await attendance.save();
    }

    async markCheckOut(
        employeeId: string,
        time: Date,
        startOfDay: Date,
        endOfDay: Date,
    ): Promise<Attendance> {
        let attendance = await attendanceModel.findOne({
            employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            }
        });

        if (!attendance) {
            throw new Error("Attendance not found");
        }

        attendance.checkOutTime = time;

        return await attendance.save();
    }

    async updateStatus(id: string, status: "Present" | "Absent" | "Late" | "Leave" | "Pending"): Promise<Attendance | null> {
        return await attendanceModel.findByIdAndUpdate(id , {status});
    }
}