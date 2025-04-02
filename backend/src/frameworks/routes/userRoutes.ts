import express, { Request, Response } from "express";
import {
    userController,
    userProfile,
    refreshController,
    leaveBalanceController,
    leaveRequestController,
    leaveTypeController
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
            (req: Request, res: Response) => userController.login(req, res),
        );

        this.router.post(
            "/logout",
            (req: Request, res: Response) => userController.logout(req, res),
        );
        this.router.post(
            '/refresh-token/:role',
            (req: Request, res: Response) => refreshController.refreshToken(req, res)
        );

        this.router
            .get(
                "/profile/:userId",
                verifyAuth("user"),
                (req: Request, res: Response) => userProfile.getProfileDetails(req, res),
            )
            .patch(
                "/profile/:userId",
                verifyAuth("user"),
                upload.single("profilePic"),
                (req: Request, res: Response) => userProfile.updateprofile(req, res),
            )
            .patch(
                "/profile/:userId/password",
                verifyAuth("user"),
                (req: Request, res: Response) => userProfile.changePassword(req, res),
            );
        this.router
            .get(
                "/leave/balance/:userId",
                verifyAuth("user"),
                (req: Request, res: Response) => leaveBalanceController.getLeaveBalanceById(req, res)
            )

        this.router
            .post(
                "/leave/request",
                verifyAuth("user"),
                (req: Request, res: Response) => leaveRequestController.createLeaveRequest(req, res),
            )

            .get(
                "/leave/request/:userId",
                verifyAuth("user"),
                (req: Request, res: Response) => leaveRequestController.getLeaveRequestsByEmployee(req, res),
            )

            .delete(
                "/leave/request/:leaveRequestId",
                verifyAuth("user"),
                (req: Request, res: Response) => leaveRequestController.cancelLeaveRequest(req , res)
            )

        this.router
            .get(
                "/leave/types",
                verifyAuth("user"),
                (req: Request, res: Response) => leaveTypeController.getAllLeaveTypes(req, res)
            )
            

            
    }

    public getRoute(): express.Router {
        return this.router;
    }
}