import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { MESSAGES } from "../../shared/constants";
import { inject, injectable } from "tsyringe";
import { IMessageUseCase } from "../../entities/useCaseInterface/IMessageUseCase";

@injectable()
export class MessageController {
    constructor(
        @inject("IMessageUseCase") private messageUseCase: IMessageUseCase,
    ) { }

    async getPrivateMessages(Req: Request, res: Response): Promise<void> {
        try {
            const { user1, user2 } = Req.query;
            if (user1 && user2) {
                const messages = await this.messageUseCase.getPrivateMessages(user1.toString(), user2.toString());
                res.status(HTTP_STATUS_CODES.OK).json({
                    messages
                })
            }
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }
}