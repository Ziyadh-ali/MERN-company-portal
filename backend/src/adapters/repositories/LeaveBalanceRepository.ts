import { injectable  } from "tsyringe";
import { ILeaveBalanceRepository } from "../../entities/repositoryInterfaces/ILeaveBalance.repository";
import { LeaveBalanceModel } from "../../frameworks/database/models/user/LeaveBalanceModel";
import { LeaveBalance } from "../../entities/models/LeaveBalance.entity";

@injectable()
export class LeaveBalanceRepository implements ILeaveBalanceRepository {
    async initializeLeaveBalance(userId: string, leaveBalances: { leaveTypeId: string;totalDays : number; availableDays: number; }[]): Promise<void> {
        const newLeaveBalances = new LeaveBalanceModel({userId , leaveBalances});
        await newLeaveBalances.save();
    }

    async getLeaveBalanceByUserId(userId: string): Promise<LeaveBalance | null> {
        return await LeaveBalanceModel.findOne({userId}).lean();
    }

    async deductLeave(userId: string, leaveTypeId: string, usedDays: number): Promise<boolean> {
        const leaveBalance = await LeaveBalanceModel.findOne({userId});
        if(!leaveBalance) return false;

        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId === leaveTypeId);
        if(!leaveType || leaveType.availableDays < usedDays) return false;

        leaveType.availableDays -= usedDays;
        await leaveBalance.save();
        return true;
    }

    async restoreLeave(userId: string, leaveTypeId: string, restoredDays: number): Promise<boolean> {
        const leaveBalance = await LeaveBalanceModel.findOne({ userId });
        if (!leaveBalance) return false;
        
        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId === leaveTypeId);
        if (!leaveType) return false;
        
        leaveType.availableDays += restoredDays;
        await leaveBalance.save();
        return true;
    }

    async resetLeaveBalance(userId: string): Promise<void> {
        const leaveBalances = await LeaveBalanceModel.find({ userId });

        if (!leaveBalances || leaveBalances.length === 0) {
            throw new Error("No leave balance records found for the user.");
        }

        for (const balance of leaveBalances) {
            for (const leave of balance.leaveBalances) {
                leave.usedDays = 0;
                leave.availableDays = leave.totalDays;
            }
            await balance.save();
        }
    }

    async updateLeaveType(userId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean> {
        const leaveBalance = await LeaveBalanceModel.findOne({ userId });
        if (!leaveBalance) return false;
    
        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId === leaveTypeId);
        if (!leaveType) return false;
    
        const usedDays = leaveType.totalDays - leaveType.availableDays;
        leaveType.totalDays = newTotalDays;
        leaveType.availableDays = Math.max(0, newTotalDays - usedDays);
    
        await leaveBalance.save();
        return true;
    }

    async updateLeaveBalance(userId: string, leaveBalances: LeaveBalance["leaveBalances"]): Promise<void> {
        await LeaveBalanceModel.updateOne(
            { userId },
            { $set: { leaveBalances } }
        );
    }

    async getAllLeaveBalances(): Promise<LeaveBalance[]> {
        return await LeaveBalanceModel.find();
    }

    async deleteLeaveBalanceByUserId(userId: string): Promise<void> {
        await LeaveBalanceModel.deleteOne({ userId });
    }

    async getLeaveBalance(userId: string, leaveTypeId: string): Promise<{availableDays : number , totalDays : number} | null> {
        const leaveBalance = await LeaveBalanceModel.findOne(
            { userId, "leaveBalances.leaveTypeId": leaveTypeId },
            { "leaveBalances.$": 1 } // Project only the matching leaveTypeId
        );

        if (!leaveBalance || leaveBalance.leaveBalances.length === 0) {
            return null;
        }

        return {
            availableDays: leaveBalance.leaveBalances[0].availableDays,
            totalDays: leaveBalance.leaveBalances[0].totalDays
        };
    }
}