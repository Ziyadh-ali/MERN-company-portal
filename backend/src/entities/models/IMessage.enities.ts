import { ObjectId } from "mongoose";

export interface IMessage {
    content: string;
    sender: ObjectId;
    roomId?: ObjectId;
    recipient?: ObjectId;
    replyTo?: ObjectId;
    deliveredTo: ObjectId[];
    readBy: ObjectId[];
    createdAt: Date;
}