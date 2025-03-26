import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../service/jwt.service';
import { injectable, inject } from 'tsyringe';
import { TJwtPayload } from '../../entities/services/jwt.interface';
import jwt from 'jsonwebtoken';
import { updateCookieWithAccessToken } from '../../shared/utils/cookieHelper';
import { HTTP_STATUS_CODES } from '../../shared/constants';

@injectable()
export class RefreshController {
  constructor(
    @inject('JwtService') private jwtService: JwtService,
  ) { }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const role = req.params.role;
      const refreshToken = req.cookies[`${role}_refresh_token`];

      if (!refreshToken) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: 'Unauthorized: No refresh token provided' });
        return;
      }

      const decoded = this.jwtService.verifyRefreshToken(refreshToken) as TJwtPayload;

      const newPayload = {
          id : decoded.id,
          email : decoded.email,
          role : decoded.role,
      }

      const accessToken = this.jwtService.generateAccessToken(newPayload);

      updateCookieWithAccessToken(
        res,
        accessToken,
        `${role}_access_token`,
      );

      res.status(HTTP_STATUS_CODES.OK).json({ accessToken });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid or Expired Refresh Token") {
        console.log("error undd")
        res.status(HTTP_STATUS_CODES.FORBIDDEN).json({ message: "Forbidden: Invalid or expired refresh token" });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}