import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AdminLogin } from "../../../useCases/admin/adminLogin";
import { CreateAdmin } from "../../../useCases/admin/adminCreate";
import { setAuthCookies, clearAuthCookies, updateCookieWithAccessToken } from "../../../shared/utils/cookieHelper";
import { JwtService } from "../../service/jwt.service";
import { TJwtPayload } from "../../../entities/services/jwt.interface";
import jwt from "jsonwebtoken"

@injectable()
export class AdminController {
    constructor(
        @inject("AdminLogin") private adminLogin: AdminLogin,
        @inject("CreateAdmin") private createAdmin: CreateAdmin,
        @inject("JwtService") private jwtService: JwtService,
    ) {
    }


    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!this.adminLogin) {
            throw new Error("adminLogin dependency is not injected");
        }
        try {
            const response = await this.adminLogin.execute(email, password);

            if (response) {
                setAuthCookies(
                    res,
                    response.accessToken,
                    response.refreshToken,
                    "admin_access_token",
                    "admin_refresh_token",
                );

                res.status(200).json({
                    success: true,
                    message: "Login successfull",
                    admin: response.admin,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                console.error("An unknown error occurred");
            }
        }
    }

    async logout(req: Request, res: Response) {
        try {
            clearAuthCookies(res , "admin_access_token" , "admin_refresh_token");
            res.status(200).json({
                success: true,
                message: "Logout successfull",
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to logout' });
        }
    }

    async save(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const response = await this.createAdmin.execute(email, password);
            res.status(201).json(response);
        } catch (error) {
            throw new Error("not saved");
        }
    }
    async refreshToken(req: Request, res: Response) {
        try {
            // Extract the refresh token from cookies
            const refreshToken = req.cookies.admin_refresh_token;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Unauthorized: No refresh token provided' });
            }

            // Verify the refresh token
            const decoded = this.jwtService.verifyRefreshToken(refreshToken) as TJwtPayload;

            // Generate a new access token
            const accessToken = this.jwtService.generateAccessToken(decoded);

            // Update the access token in cookies
            updateCookieWithAccessToken(
                res,
                accessToken,
                "admin_access_token",
            );

            // Return the new access token in the response
            res.status(200).json({
                success: true,
                message: "Access token refreshed",
                accessToken,
            });
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Refresh token expired' });
            }
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Unauthorized: Invalid refresh token' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}