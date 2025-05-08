import { ObjectId } from "mongoose";

export interface IMessage {
    _id?: string | ObjectId;
    content: string;
    sender: ObjectId;
    roomId?: ObjectId;
    recipient?: ObjectId;
    media?: {
        url: string;
        type: 'image' | 'video' | 'document';
        public_id?: string;
    };
    createdAt?: Date;
}