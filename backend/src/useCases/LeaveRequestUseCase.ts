import { inject, injectable } from "tsyringe";
import { ILeaveRequestRepository } from "../entities/repositoryInterfaces/ILeaveRequest.repository";
import { ILeaveRequestUseCase } from "../entities/useCaseInterface/ILeaveRequestUseCase";
import { LeaveRequest } from "../entities/models/LeaveRequest.entity";
import { ILeaveBalanceRepository } from "../entities/repositoryInterfaces/ILeaveBalance.repository";
import { MESSAGES } from "../shared/constants";


@injectable()
export class LeaveRequestUseCase implements ILeaveRequestUseCase {
    constructor(
        @inject("ILeaveRequestRepository") private leaveRequestRepository: ILeaveRequestRepository,
        @inject("ILeaveBalanceRepository") private leaveBalanceRepository: ILeaveBalanceRepository,
    ) { }

    async createLeaveRequest(leaveRequest: LeaveRequest): Promise<LeaveRequest> {
        if (!leaveRequest || !leaveRequest.employeeId || !leaveRequest.leaveTypeId) {
            throw new Error("Employee ID or Leave Type ID is missing");
        }
        const leaveBalance = await this.leaveBalanceRepository.getLeaveBalance(leaveRequest?.employeeId.toString(), leaveRequest.leaveTypeId.toString());
        if (!leaveBalance) {
            throw new Error(MESSAGES.ERROR.LEAVE.NO_LEAVE_BALANCE);
        }

        const startDate = new Date(leaveRequest.startDate);
        const endDate = new Date(leaveRequest.endDate);
        const requestedDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (requestedDays > leaveBalance.availableDays) {
            throw new Error(MESSAGES.ERROR.LEAVE.INSUFFICIENT_BALANCE)
        }

        return await this.leaveRequestRepository.createLeaveRequest(leaveRequest);
    }

    async getLeaveRequestByEmployee(userId: string): Promise<LeaveRequest[]> {
        return await this.leaveRequestRepository.getLeaveRequestByEmployee(userId);
    }

    async getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]> {
        return await this.leaveRequestRepository.getLeaveRequestForApproval(managerId);
    }

    async cancelLeaveRequest(leaveRequestId: string): Promise<boolean> {
        return await this.leaveRequestRepository.cancelLeaveRequest(leaveRequestId);
    }

    async updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected",): Promise<boolean> {
        const leaveRequest = await this.leaveRequestRepository.getLeaveRequestById(leaveRequestId);

        if (!leaveRequest) {
            throw new Error("Leave request not found");
        }
        if (status === "Approved") {
            const { employeeId, leaveTypeId, startDate, endDate } = leaveRequest;

            const requestedDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

            const success = await this.leaveBalanceRepository.deductLeave(employeeId.toString(), leaveTypeId.toString(), requestedDays);

            if (!success) {
                throw new Error("Failed to deduct leave balance. Possible insufficient balance.");
            }
        }
        
        return await this.leaveRequestRepository.updateLeaveRequestStatus(leaveRequestId, status);
    }

    async editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean> {
        return await this.leaveRequestRepository.editLeaveRequest(leaveRequestId, updates);
    }

    async getAllLeaveRequests(): Promise<LeaveRequest[]> {
        return await this.leaveRequestRepository.getAllLeaveRequests();
    }
}