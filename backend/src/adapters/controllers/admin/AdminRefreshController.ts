import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../service/jwt.service';
import { injectable, inject } from 'tsyringe';
import { TJwtPayload } from '../../../entities/services/jwt.interface';
import jwt from 'jsonwebtoken';
import { updateCookieWithAccessToken } from '../../../shared/utils/cookieHelper';

@injectable()
export class AdminRefreshController {
  constructor(
    @inject('JwtService') private jwtService: JwtService,
  ) {}

  refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.admin_access_token;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized: No refresh token provided' });
      }

      const decoded = this.jwtService.verifyRefreshToken(refreshToken) as TJwtPayload;

      const accessToken = this.jwtService.generateAccessToken(decoded);

      updateCookieWithAccessToken(
        res,
        accessToken,
        "admin_access_token",
      );

      return res.status(200).json({ accessToken });
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