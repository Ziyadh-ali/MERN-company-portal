import { ObjectId } from "mongoose";

export interface User {
    _id?: ObjectId | string;
    fullName : string,
    email : string;
    department : string;
    role : "hr" | "developer" | "projectManager";
    status : string,
    password : string;
    phone?: number,
    address?: string,
    joinedAt?: Date ,
    manager?: string,
    profilePic?: string,
    createdAt?: Date;
    updatedAt?: Date;
}