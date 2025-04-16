import express, { Request, Response } from "express";
import {
    employeeController,
    employeeProfile,
    refreshController,
    leaveBalanceController,
    leaveRequestController,
    leaveTypeController,
    forgotPasswordController,
    resetPasswordController,
    attendanceController,
    meetingController
} from "../di/resolver";
import { verifyAuth } from "../../adapters/middlewares/authMiddleware";
import upload from "../../adapters/service/multer";


export class UserRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router()
        this.setRoutes();
    }

    private setRoutes(): void {
        this.router.post(
            "/login",
            (req: Request, res: Response) => employeeController.login(req, res),
        );

        this.router.post(
            "/logout",
            (req: Request, res: Response) => employeeController.logout(req, res),
        );
        this.router.post(
            '/refresh-token/:role',
            (req: Request, res: Response) => refreshController.refreshToken(req, res)
        );
        this.router.post(
            "/forgot-password",
            (req: Request, res: Response) => forgotPasswordController.execute(req, res)
        )
        this.router.post(
            "/reset-password",
            (req: Request, res: Response) => resetPasswordController.execute(req, res),
        )

        this.router
            .get(
                "/profile/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => employeeProfile.getProfileDetails(req, res),
            )
            .patch(
                "/profile/:employeeId",
                verifyAuth("employee"),
                upload.single("profilePic"),
                (req: Request, res: Response) => employeeProfile.updateprofile(req, res),
            )
            .patch(
                "/profile/:employeeId/password",
                verifyAuth("employee"),
                (req: Request, res: Response) => employeeProfile.changePassword(req, res),
            );
        this.router
            .get(
                "/leave/balance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveBalanceController.getLeaveBalanceById(req, res)
            )

        this.router
            .post(
                "/leave/request",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveRequestController.createLeaveRequest(req, res),
            )

            .get(
                "/leave/request/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveRequestController.getLeaveRequestsByEmployee(req, res),
            )

            .delete(
                "/leave/request/:leaveRequestId",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveRequestController.cancelLeaveRequest(req, res)
            )

        this.router
            .get(
                "/leave/types",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveTypeController.getAllLeaveTypes(req, res)
            )

        this.router
            .post(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.checkIn(req, res)
            )
            .patch(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.checkOut(req, res)
            )
            .get(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.getTodayAttendance(req, res)
            )
            .get(
                "/attendance/month/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.getAttendanceByMonth(req, res)
            )

        this.router
            .post(
                "/meeting",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.createMeeting(req, res)
            )
            .get(
                "/meeting/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.getMeetingByEmployeeId(req, res)
            )
            .patch(
                "/meeting/:meetingId/link",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.updateMeetingStatusAnsLink(req, res)
            )
            .patch(
                "/meeting/:meetingId/status",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.updateMeetingStatusAnsLink(req, res)
            )
            .patch(
                "/meeting/:meetingId",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.updateMeeting(req, res)
            )
            .delete(
                "/meeting/:meetingId",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.deleteMeeting(req, res)
            )
    }

    public getRoute(): express.Router {
        return this.router;
    }
}