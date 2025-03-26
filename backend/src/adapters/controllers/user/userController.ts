import { Request, response, Response } from "express";
import { UserLogin } from "../../../useCases/user/userLoginUseCase";
import { inject, injectable } from "tsyringe";
import { setAuthCookies, clearAuthCookies } from "../../../shared/utils/cookieHelper";
import { HTTP_STATUS_CODES } from "../../../shared/constants";

@injectable()
export class UserController {
    constructor(
        @inject("UserLogin") private userLogin: UserLogin,
    ) { }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const response = await this.userLogin.execute(email, password);
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
                    message: "Login successfull",
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
            clearAuthCookies(
                res,
                "user_access_token",
                "user_refresh_token",
            );
    
            res.status(HTTP_STATUS_CODES.OK).json({
                success : true,
                message : "Logout Successfull",
            })
        } catch (error) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success : false,
                message : "Failed to Logout",
            });
        }
    }
}