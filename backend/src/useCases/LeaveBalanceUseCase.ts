import { injectable, inject } from "tsyringe";
import { ILeaveBalanceRepository } from "../entities/repositoryInterfaces/ILeaveBalance.repository";
import { LeaveBalance } from "../entities/models/LeaveBalance.entity";
import { ILeaveBalanceUseCase } from "../entities/useCaseInterface/ILeaveBalanceUseCase";
import { ILeaveTypeUseCase } from "../entities/useCaseInterface/ILeaveTypeUseCase";
import { ILeaveTypeRepository } from "../entities/repositoryInterfaces/ILeaveType.repository";

@injectable()
export class LeaveBalanceUseCase implements ILeaveBalanceUseCase {
    constructor(
        @inject("ILeaveBalanceRepository") private leaveBalanceRepository: ILeaveBalanceRepository,
        @inject("ILeaveTypeRepository") private leaveTypeRepository: ILeaveTypeRepository,
    ) { }

    async initializeLeaveBalance(userId: string, leaveTypes: { leaveTypeId: string; totalDays: number }[]): Promise<void> {
        const leaveBalances = leaveTypes.map(leaveType => ({
            leaveTypeId: leaveType.leaveTypeId,
            totalDays: leaveType.totalDays,
            availableDays: leaveType.totalDays,
            usedDays: 0,
        }));

        await this.leaveBalanceRepository.initializeLeaveBalance(userId, leaveBalances);
    }

    async getLeaveBalanceByUserId(userId: string): Promise<LeaveBalance | null> {
        const leaveBalances = await this.leaveBalanceRepository.getLeaveBalanceByUserId(userId);
        if (!leaveBalances) return null;

        const leaveTypes = await this.leaveTypeRepository.getAllLeaveTypes();

        const leaveBalancesWithNames = leaveBalances.leaveBalances.map(lb => {
            const leaveType = leaveTypes.find(lt => lt._id?lt._id.toString() === lb.leaveTypeId : "");
            return {
                leaveTypeId: lb.leaveTypeId,
                leaveTypeName: leaveType ? leaveType.name : "Unknown Leave Type",
                totalDays: lb.totalDays,
                availableDays: lb.availableDays,
                usedDays: lb.usedDays || 0
            };
        });

        return { userId: leaveBalances.userId, leaveBalances: leaveBalancesWithNames };   
    }

    async deductLeave(userId: string, leaveTypeId: string, usedDays: number): Promise<boolean> {
        return await this.leaveBalanceRepository.deductLeave(userId, leaveTypeId, usedDays);
    }

    async restoreLeave(userId: string, leaveTypeId: string, restoredDays: number): Promise<boolean> {
        return await this.leaveBalanceRepository.restoreLeave(userId, leaveTypeId, restoredDays);
    }

    async resetLeaveBalance(userId: string): Promise<void> {
        await this.leaveBalanceRepository.resetLeaveBalance(userId);
    }

    async updateLeaveType(userId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean> {
        const leaveBalance = await this.getLeaveBalanceByUserId(userId);
        if (!leaveBalance) return false;

        const leaveType = leaveBalance.leaveBalances.find(lb => lb.leaveTypeId === leaveTypeId);
        if (!leaveType) return false;

        leaveType.totalDays = newTotalDays;
        leaveType.availableDays = Math.max(0, newTotalDays - leaveType.usedDays);

        return await this.leaveBalanceRepository.updateLeaveType(userId, leaveTypeId, leaveType.availableDays);
    }

    async addLeaveTypeToAllUsers(leaveTypeId: string, totalDays: number): Promise<void> {
        const allUsersLeaveBalances = await this.leaveBalanceRepository.getAllLeaveBalances();

        for (const leaveBalance of allUsersLeaveBalances) {
            const leaveTypeExists = leaveBalance.leaveBalances.some(lb => lb.leaveTypeId === leaveTypeId);

            if (!leaveTypeExists) {
                leaveBalance.leaveBalances.push({
                    leaveTypeId,
                    totalDays,
                    availableDays: totalDays,
                    usedDays: 0,
                });

                await this.leaveBalanceRepository.updateLeaveBalance(leaveBalance.userId, leaveBalance.leaveBalances);
            }
        }
    }

    async deleteLeaveBalance(userId: string): Promise<void> {
        await this.leaveBalanceRepository.deleteLeaveBalanceByUserId(userId);
        console.log(`Leave balance deleted for user: ${userId}`);
    }
}
