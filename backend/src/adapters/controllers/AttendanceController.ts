import { Request, Response } from "express";
import { IAttendanceUseCase } from "../../entities/useCaseInterface/IAttendanceUseCase";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { MESSAGES } from "../../shared/constants";

@injectable()
export class AttendanceController {
    constructor(
        @inject("IAttendanceUseCase") private attendanceUseCase: IAttendanceUseCase,
    ) { }

    async checkIn(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            await this.attendanceUseCase.checkIn(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.CHECKED_IN
            });
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.CHECK_IN_FAILED,
            });
        }
    }

    async checkOut(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            await this.attendanceUseCase.checkOut(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.CHECKED_OUT
            });
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.CHECK_OUT_FAILED,
            });
        }
    }

    async getTodayAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            const todayAttendance = await this.attendanceUseCase.getTodayAttendance(employeeId)
            res.status(HTTP_STATUS_CODES.OK).json({
                todayAttendance,
            });
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }

    async getAttendanceByMonth(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            const yearParam = req.query.year;
            const monthParam = req.query.month;

            if (typeof yearParam !== "string" || typeof monthParam !== "string") {
                throw new Error("Year and month must be provided as query parameters.");
            }

            const year = parseInt(yearParam, 10);
            const month = parseInt(monthParam, 10);

            const attendancesOfMonth = await this.attendanceUseCase.getAttendanceByMonth(employeeId, year, month);

            res.status(HTTP_STATUS_CODES.OK).json({
                attendancesOfMonth,
            });

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }
}