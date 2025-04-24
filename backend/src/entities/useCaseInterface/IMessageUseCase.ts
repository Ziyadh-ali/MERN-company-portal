import { IMessage } from "../models/IMessage.enities";

export interface IMessageUseCase {
    createMessage(data: {
        content: string;
        sender: string;
        recipient?: string;
        roomId?: string;
        replyTo?: string;
    }): Promise<IMessage>;

    getPrivateMessages(user1: string, user2: string): Promise<IMessage[]>;
}