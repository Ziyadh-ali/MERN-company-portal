import { inject, injectable } from "tsyringe";
import { LeaveRequest } from "../../entities/models/LeaveRequest.entity";
import { ILeaveRequestRepository } from "../../entities/repositoryInterfaces/ILeaveRequest.repository";
import { LeaveRequestModel } from "../../frameworks/database/models/user/LeaveRequestModel";

@injectable()
export class LeaveRequestRepository implements ILeaveRequestRepository {
    async createLeaveRequest(leaveRequest: LeaveRequest): Promise<LeaveRequest> {
        return await LeaveRequestModel.create(leaveRequest);
    }

    async getLeaveRequestForApproval(managerId: string): Promise<LeaveRequest[]> {
        return await LeaveRequestModel.find({ assignedManager: managerId, status: "Pending" }).lean();
    }

    async getLeaveRequestByEmployee(userId: string): Promise<LeaveRequest[]> {
        return await LeaveRequestModel.find({ employeeId: userId })
            .populate({
                path: "leaveTypeId",
                select: "name",
            })
            .lean();
    }

    async updateLeaveRequestStatus(leaveRequestId: string, status: "Approved" | "Rejected"): Promise<boolean> {
        const result = await LeaveRequestModel.updateOne({ _id: leaveRequestId }, { $set: { status } }, { new: true });
        return result.modifiedCount > 0;
    }

    async editLeaveRequest(leaveRequestId: string, updates: Partial<LeaveRequest>): Promise<boolean> {
        const leaveRequest = await LeaveRequestModel.findById(leaveRequestId);

        if (!leaveRequest || leaveRequest.status !== "Pending") return false;

        Object.assign(leaveRequest, updates);
        await leaveRequest.save();
        return true;
    }

    async cancelLeaveRequest(leaveRequestId: string): Promise<boolean> {
        await LeaveRequestModel.deleteOne({ _id: leaveRequestId });
        return true;
    }

    async getAllLeaveRequests(): Promise<LeaveRequest[]> {
        return await LeaveRequestModel.find({})
            .populate({
                path: "leaveTypeId",
                select: "name",
            })
            .populate({
                path: "employeeId",
                select: "fullName role",
            })
    }

    async getLeaveRequestById(leaveRequestId: string): Promise<LeaveRequest | null> {
        return await LeaveRequestModel.findById(leaveRequestId).lean();
    }

    async setRejectionReason(leaveRequestId: string, reason: string): Promise<void> {
        await LeaveRequestModel.findByIdAndUpdate(leaveRequestId , {
            rejectionReason : reason,
        });
    }
}