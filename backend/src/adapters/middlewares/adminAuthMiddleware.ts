import { Request, Response, NextFunction } from "express";
import { JwtService } from "../service/jwt.service";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"

const tokenService = new JwtService();


export interface CustomJwtPayload extends JwtPayload {
    _id: string;
    email: string;
    role: string;
    access_token: string;
    refresh_token: string;
};

export interface CustomRequest extends Request {
    user: CustomJwtPayload;
}

const extractToken = (
    req: Request
): { accessToken: string; refreshToken: string } | null => {
    const pathSegments = req.path.split("/");
    console.log(pathSegments);
    const privateRouteIndex = pathSegments.indexOf("");
    console.log(privateRouteIndex);

    if (privateRouteIndex !== -1 && pathSegments[privateRouteIndex + 1]) {
        const userType = pathSegments[privateRouteIndex + 1];
        return {
            accessToken: req.cookies[`${userType}_access_token`] || null,
            refreshToken: req.cookies[`${userType}_refresh_token`] || null,
        };
    }

    return null;
};

export const verifyAdminAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = extractToken(req);

        if (!token) {
            console.log("no token");
            res
                .status(401)
                .json({ message: "Unauthorized access." });
            return
        }

        const { user, error } = tokenService.verifyAccessToken(
            token.accessToken
        ) as CustomJwtPayload;

        if (error) {
            if (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({ message: 'Access token expired' });
                }
                if (error instanceof jwt.JsonWebTokenError) {
                    return res.status(401).json({ message: 'Unauthorized: Invalid access token' });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        }

        console.log(user);

        if (!user || !user.id) {
            res
                .status(401)
                .json({ message: "Unauthorized access." });
            return
        }

        (req as CustomRequest).user = {
            ...user,
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
        };

        next();

    } catch (error) {

    }
}