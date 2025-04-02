import { inject, injectable } from "tsyringe";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterface/IRefreshTokenUseCase";
import { JwtService } from "../../adapters/service/jwt.service";
import { updateCookieWithAccessToken } from "../../shared/utils/cookieHelper";
import { Response } from "express";
import { TJwtPayload } from "../../entities/services/jwt.interface";


@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject('JwtService') private jwtService: JwtService,
    ) { }
    async execute(refreshToken: string , res : Response , role : string): Promise<{ accessToken: string; }> {
        try {
            const decoded = this.jwtService.verifyRefreshToken(refreshToken) as TJwtPayload;

            const newPayload = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            }

            const accessToken = this.jwtService.generateAccessToken(newPayload);

            updateCookieWithAccessToken(
                res,
                accessToken,
                `${role}_access_token`,
            );

            return {accessToken}
        } catch (error) {
            console.log(error);
            throw new Error("Error in refresh end point");
        }
    }
}