import { inject, injectable } from "tsyringe";
import { IMessageRepository } from "../entities/repositoryInterfaces/IMessage.respository";
import { IMessage } from "../entities/models/IMessage.enities";
import { IMessageUseCase } from "../entities/useCaseInterface/IMessageUseCase";

@injectable()
export class MessageUseCase implements IMessageUseCase {
  constructor(
    @inject("IMessageRepository") private messageRepository: IMessageRepository,
  ) { }

  async createMessage(data: {
    content: string;
    sender: string;
    recipient?: string;
    roomId?: string;
    replyTo?: string;
  }): Promise<IMessage> {
    const savedMessage = await this.messageRepository.createMessage(data)
    return savedMessage;
  }
  
  async getPrivateMessages(user1: string, user2: string): Promise<IMessage[]> {
    return await this.messageRepository.getPrivateMessages(user1 , user2);
  }
};