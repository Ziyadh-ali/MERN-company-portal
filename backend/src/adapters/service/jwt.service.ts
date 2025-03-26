import { injectable } from "tsyringe";
import { TJwtPayload ,AuthServiceInterface} from "../../entities/services/jwt.interface";
import  jwt ,{JwtPayload,Secret } from "jsonwebtoken";
import { config } from "../../shared/config";
import ms from "ms";

@injectable()
export class JwtService implements AuthServiceInterface {
    private accessSecret : Secret;
    private accessExpiresIn : string;
    private refreshSecret : Secret;
    private refreshExpiresIn : string;
    constructor(){
        this.accessSecret = config.jwt.ACCESS_SECRET_KEY,
        this.accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN,

        this.refreshSecret = config.jwt.REFRESH_SECRET_KEY,
        this.refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN
    }

    generateAccessToken(data: TJwtPayload): string {
        return jwt.sign(data , this.accessSecret, {expiresIn : this.accessExpiresIn as ms.StringValue});
    }

    generateRefreshToken(data: TJwtPayload): string {
        return jwt.sign(data, this.refreshSecret,{expiresIn : this.refreshExpiresIn as ms.StringValue});
    }

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.accessSecret) as TJwtPayload
        } catch (error) {
            throw new Error("Invalid or Expired Access Token");
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.refreshSecret) as JwtPayload;
        } catch (error) {
            throw new Error("Invalid or Expired Refresh Token");
        }
    }

    decodeRefreshToken(token: string): JwtPayload | null {
        const decode = jwt.decode(token) as JwtPayload;
        return decode;
    }
}