import { Request, response, Response } from "express";
import { IUserLoginUseCase } from "../../../entities/useCaseInterface/IUserLoginUseCase";
import { inject, injectable } from "tsyringe";
import { setAuthCookies, clearAuthCookies } from "../../../shared/utils/cookieHelper";
import { HTTP_STATUS_CODES, MESSAGES } from "../../../shared/constants";

@injectable()
export class UserController {
    constructor(
        @inject("IUserLoginUseCase") private userLoginUseCase: IUserLoginUseCase,
    ) { }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const response = await this.userLoginUseCase.login(email, password);
            if (response) {
                if(response.user.status === "inactive"){
                    res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
                        success: false,
                        message: "You have blocked by admin",
                    });
                }
                setAuthCookies(
                    res,
                    response.accessToken,
                    response.refreshToken,
                    "user_access_token",
                    "user_refresh_token",
                );
                res.status(HTTP_STATUS_CODES.OK).json({
                    success: true,
                    message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
                    user: response?.user
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: error.message });
            } else {
                console.error("An unknown error occurred");
            }
        }
    }

    async logout(req : Request , res : Response) : Promise<void>{
        try {

            this.userLoginUseCase.logout(res);
            
            res.status(HTTP_STATUS_CODES.OK).json({
                success : true,
                message : MESSAGES.SUCCESS.LOGOUT_SUCCESS,
            })
        } catch (error) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success : false,
                message : "Failed to Logout",
            });
        }
    }
}