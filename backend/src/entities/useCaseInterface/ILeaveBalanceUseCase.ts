import { LeaveBalance } from "../models/LeaveBalance.entity";

export interface ILeaveBalanceUseCase {
    initializeLeaveBalance(userId: string, leaveBalances: { leaveTypeId: string; totalDays: number }[]): Promise<void>;
    getLeaveBalanceByUserId(userId: string): Promise<LeaveBalance | null>;
    deductLeave(userId: string, leaveTypeId: string, usedDays: number): Promise<boolean>;
    restoreLeave(userId: string, leaveTypeId: string, restoredDays: number): Promise<boolean>;
    resetLeaveBalance(userId: string): Promise<void>;
    updateLeaveType(userId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean>;
    addLeaveTypeToAllUsers(leaveTypeId: string, totalDays: number): Promise<void>;
    deleteLeaveBalance(userId: string): Promise<void>;
}