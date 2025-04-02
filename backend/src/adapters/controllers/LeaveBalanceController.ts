import { inject , injectable } from "tsyringe";
import { Request , Response } from "express";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { ILeaveBalanceUseCase } from "../../entities/useCaseInterface/ILeaveBalanceUseCase";
import { MongooseRawResultQueryMiddleware } from "mongoose";

@injectable()
export class LeaveBalanceController {
    constructor(
        @inject("ILeaveBalanceUseCase") private leaveBalanceUseCase : ILeaveBalanceUseCase,
    ) {}

    async getLeaveBalanceById (req : Request , res : Response) : Promise<void> {
        const {userId} = req.params;
        try {
            if(!userId){
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    success : false,
                    message : MESSAGES.ERROR.USER.NO_USER_ID
                });
            }
            const leaveBalances = await this.leaveBalanceUseCase.getLeaveBalanceByUserId(userId);

              

            res.status(HTTP_STATUS_CODES.OK).json({
                success : true , 
                leaveBalances,
            })
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                success : false,
                message : MESSAGES.ERROR.GENERIC
            });
        }
    }
}