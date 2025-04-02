import { LeaveBalance } from "../models/LeaveBalance.entity";


export interface ILeaveBalanceRepository {
    initializeLeaveBalance(userId: string, leaveBalances: { leaveTypeId: string; totalDays: number , availableDays : number }[]): Promise<void>;
    getLeaveBalanceByUserId(userId: string): Promise<LeaveBalance | null>;
    deductLeave(userId: string, leaveTypeId: string, usedDays: number): Promise<boolean>;
    restoreLeave(userId: string, leaveTypeId: string, restoredDays: number): Promise<boolean>;
    resetLeaveBalance(userId: string): Promise<void>;
    updateLeaveType(userId: string, leaveTypeId: string, newTotalDays: number): Promise<boolean>;
    updateLeaveBalance(userId: string, leaveBalances: LeaveBalance["leaveBalances"]): Promise<void>;
    getAllLeaveBalances(): Promise<LeaveBalance[]>;
    deleteLeaveBalanceByUserId(userId: string): Promise<void>;
    getLeaveBalance(userId: string, leaveTypeId: string): Promise<{availableDays : number , totalDays : number}  | null>;
}

