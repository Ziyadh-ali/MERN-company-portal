import { LeaveRequest } from "../models/LeaveRequest.entity";

export interface ILeaveRequestRepository {
    createLeaveRequest(leaveRequest : LeaveRequest ) : Promise<LeaveRequest>;
    getLeaveRequestForApproval(managerId : string) : Promise<LeaveRequest[]>;
    getLeaveRequestByEmployee(userId : string) : Promise<LeaveRequest[]>;
    updateLeaveRequestStatus(leaveRequestId : string , status : "Approved" | "Rejected") : Promise<boolean>;
    editLeaveRequest(leaveRequestId : string , updates : Partial<LeaveRequest>) : Promise<boolean>;
    cancelLeaveRequest(leaveRequestId : string) : Promise<boolean>;
    getAllLeaveRequests() : Promise<LeaveRequest[]>
    getLeaveRequestById(leaveRequestId: string): Promise<LeaveRequest | null>;
    setRejectionReason(leaveRequestId : string , reason : string) : Promise<void>;
}