import { ObjectId } from "mongoose";

export interface INotification {
    _id: string | ObjectId;
    recipient: string | ObjectId;
    sender?: string | ObjectId;
    type: 'message' | 'group_invite' | 'mention' | 'reaction' | 'group_update';
    content: string;
    read?: boolean;
    createdAt: Date;
    updatedAt: Date;
}