import { Response } from "express";
import { UserLoginResponse } from "../userInterface/userLogin.interface";


export interface IUserLoginUseCase {
    login(email : string , password : string) : Promise<UserLoginResponse | null>;
    logout(res : Response) : Promise<void>;
}