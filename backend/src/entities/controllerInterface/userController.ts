import { Request, Response } from "express";


export interface IUserProfile {
    getProfileDetails(
        req : Request, 
        res : Response,
    ) : Promise<void>;

    updateprofile(
        req : Request , 
        res : Response
    ) : Promise<void>;

    changePassword(
        req : Request , 
        res : Response
    ) : Promise<void>;
}