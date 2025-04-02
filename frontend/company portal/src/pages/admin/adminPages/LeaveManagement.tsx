import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import AdminSideBar from "../../../components/adminComponents/AdminSideBar";
import { useSnackbar } from "notistack";
import { getAllLeaveRequestsService, updateLeaveRequestStatusService } from "../../../services/admin/adminUserM";

// Define LeaveRequest interface
export interface LeaveRequest {
    _id?: string;
    employeeId: {
        fullName: string,
        role : string , 
        _id: string,
    }
    leaveTypeId: {
        name: string,
        _id: string,
    }
    days : number;
    startDate: string;
    endDate: string;
    reason?: string;
    status?: "Pending" | "Approved" | "Rejected";
}

// Mock approval/rejection services (Replace with API calls)
const approveLeaveRequestService = async (id: string) => ({ data: { _id: id, status: "Approved" } });
const rejectLeaveRequestService = async (id: string) => ({ data: { _id: id, status: "Rejected" } });

const LeaveManagementPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

    // Fetch leave requests on mount
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const data = await getAllLeaveRequestsService();
                const updatedLeaveRequests = (data.leaveRequests || []).map((request: LeaveRequest) => {
                    const startDate = new Date(request.startDate);
                    const endDate = new Date(request.endDate); 
                    
                    const timeDifference = endDate.getTime() - startDate.getTime();
                    
                    const days = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
                    
                    return { ...request, days: days };
                });
                setLeaveRequests(updatedLeaveRequests || []);
            } catch (error) {
                console.error("Failed to fetch leave requests:", error);
                enqueueSnackbar("Failed to fetch leave requests", { variant: "error" });
            }
        };
        fetchLeaveRequests();
    }, []);

    // Handle approve/reject actions
    const handleApprove = async (id: string , userId : string) => {
        try {
            await updateLeaveRequestStatusService(id , "Approved",userId);
            setLeaveRequests(leaveRequests.map(req => req._id === id ? { ...req, status: "Approved" } : req));
            enqueueSnackbar("Leave request approved successfully", { variant: "success" });
        } catch (error) {
            console.error("Error approving leave request:", error);
            enqueueSnackbar("Failed to approve leave request", { variant: "error" });
        }
    };

    const handleReject = async (id: string , userId : string) => {
        try {
            await updateLeaveRequestStatusService(id , "Rejected",userId);
            setLeaveRequests(leaveRequests.map(req => req._id === id ? { ...req, status: "Rejected" } : req));
            enqueueSnackbar("Leave request rejected successfully", { variant: "success" });
        } catch (error) {
            console.error("Error rejecting leave request:", error);
            enqueueSnackbar("Failed to reject leave request", { variant: "error" });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSideBar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-semibold text-gray-800">Leave Management</h1>
                <p className="text-sm text-gray-600">Manage all leave requests</p>

                {/* Leave Requests Table */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {leaveRequests.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Leave Type</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaveRequests.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell>{request.employeeId.fullName}</TableCell>
                                            <TableCell>{request.employeeId.role}</TableCell>
                                            <TableCell>{request.leaveTypeId.name}</TableCell>
                                            <TableCell>{request.startDate}</TableCell>
                                            <TableCell>{request.endDate}</TableCell>
                                            <TableCell>{request.days}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${request.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                                        request.status === "Approved" ? "bg-green-100 text-green-800" :
                                                            "bg-red-100 text-red-800"
                                                    }`}>
                                                    {request.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {request.status === "Pending" ? (
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" onClick={() => handleApprove(request._id as string , request.employeeId._id as string)}>
                                                            <CheckCircle size={16} className="mr-1" /> Approve
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleReject(request._id as string , request.employeeId._id as string)}>
                                                            <XCircle size={16} className="mr-1" /> Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button variant="outline" size="sm" disabled>{request.status}</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <h1 className="text-center text-gray-600">No Leave Requests</h1>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LeaveManagementPage;
