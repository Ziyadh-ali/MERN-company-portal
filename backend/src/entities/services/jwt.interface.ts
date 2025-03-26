import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

export interface TJwtPayload extends JwtPayload {
  id?: ObjectId | string;
  email : string;
  role: string;
}

export interface AuthServiceInterface {
  generateAccessToken(data: TJwtPayload): string;
  generateRefreshToken(data: TJwtPayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
  decodeRefreshToken(token: string): JwtPayload | null;
}