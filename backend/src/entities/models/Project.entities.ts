import { ObjectId } from "mongoose";

export interface IProject {
    projectManager ?: string | ObjectId;
    name : string;
    startDate : Date;
    endDate : Date;
    members : ObjectId[] | string[];
    createdAt ?: Date;
    updatedAt ?: Date;
}