import { User } from "./user.interface";

export interface UserLoginInterface {
    email : string , 
    password : string,
}

export interface UserLoginResponse {
    accessToken : string;
    refreshToken : string;
    user : Partial<User>;
}