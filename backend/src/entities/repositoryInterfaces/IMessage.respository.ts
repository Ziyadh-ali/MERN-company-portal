import { IMessage } from "../models/IMessage.enities";


export interface IMessageRepository {
  createMessage(data: {
    content: string;
    sender: string;
    recipient?: string;
    roomId?: string;
    replyTo?: string;
  }): Promise<IMessage>;

  getMessagesByRoomId(roomId: string): Promise<IMessage[]>;

  getPrivateMessages(user1: string, user2: string): Promise<IMessage[]>;

  markAsDelivered(messageId: string, userId: string): Promise<void>;

  markAsRead(messageId: string, userId: string): Promise<void>;

  deleteMessage(messageId: string): Promise<void>;
}
