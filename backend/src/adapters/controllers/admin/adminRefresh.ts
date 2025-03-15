import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AdminLogin } from "../../../useCases/admin/adminLogin";
import { CreateAdmin } from "../../../useCases/admin/adminCreate";
import { setAuthCookies, clearAuthCookies, updateCookieWithAccessToken } from "../../../shared/utils/cookieHelper";
import { JwtService } from "../../service/jwt.service";
import { TJwtPayload } from "../../../entities/services/jwt.interface";
import jwt from "jsonwebtoken";

@injectable()
export class AdminRefresh {
    constructor(
        @inject("AdminLogin") private adminLogin: AdminLogin,
        @inject("CreateAdmin") private createAdmin: CreateAdmin,
        @inject("JwtService") private jwtService: JwtService, // Inject JwtService
    ) {}
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