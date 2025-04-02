import { LeaveRequest } from "../models/LeaveRequest.entity";

export interface ILeaveRequestUseCase {
    createLeaveRequest(leaveRequest: LeaveRequest): Promise<LeaveRequest>;
    getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]>;
    getLeaveRequestByEmployee(userId: string): Promise<LeaveRequest[]>;
    updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected" , rejectionReason ?: string): Promise<boolean>;
    editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean>;
    cancelLeaveRequest(leaveRequestId: string): Promise<boolean>;
    getAllLeaveRequests() : Promise<LeaveRequest[] >
}