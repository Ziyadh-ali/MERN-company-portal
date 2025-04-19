import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { X } from "lucide-react";
import { EmployeeHeader, } from "../../../components/employeeComponents/employeeHeader";
import { useEffect, useState } from "react";
import {
  addLeaveRequestService,
  deleteLeaveRequest,
  getLeaveBalancesService,
  getLeaveRequestsService,
} from "../../../services/user/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import AddLeaveRequestModal, { LeaveRequest } from "../modals/AddLeaveRequestModal";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
import { useConfirmDeleteModal } from "../../../components/useConfirm";
import EmployeeSidebar from "../../../components/employeeComponents/employeeSidebar";

// User interface
export interface User {
  _id?: string;
  fullName: string;
  email: string;
  department: string;
  role: "hr" | "developer" | "projectManager";
  status: string;
  password: string;
  phone?: number;
  address?: string;
  joinedAt?: Date;
  manager?: string;
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for leave data
interface Leave {
  _id: string;
  leaveTypeId: {
    name: string,
    _id: string
  }
  startDate: string;
  endDate: string;
  reason: string;
  status: "Accepted" | "Rejected" | "Pending";
}


interface LeaveTypes {
  userId: string,
  leaveBalances: [{
    availableDays: 15,
    leaveTypeId: string,
    leaveTypeName: string,
    totalDays: number,
    usedDays: number,
  }]
}




const LeavePage = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypes>();
  const { confirmDelete, ConfirmDeleteModal } = useConfirmDeleteModal();
  const [leaveHistory, setLeaveHistory] = useState<Leave[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const { employee } = useSelector((state: RootState) => state.employee);

  useEffect(() => {
    const fethchLeaveBalance = async () => {
      if (employee?._id) {
        const response = await getLeaveBalancesService(employee._id);
        setLeaveTypes(response.leaveBalances);
      }
    }
    const fetchLeaveHistory = async () => {
      if (employee?._id) {
        const response = await getLeaveRequestsService(employee?._id);
        console.log(response.leaveRequests)
        setLeaveHistory(response.leaveRequests);
      }
    }
    fethchLeaveBalance();
    fetchLeaveHistory();
  }, [employee?._id])

  const handleLeaveAdd = async (data: LeaveRequest) => {
    const newData = { ...data, employeeId: employee?._id }
    await addLeaveRequestService(newData);
    setOpenModal(false);
  }

  const handleDelete = async (leaveRequestId: string) => {
    confirmDelete({id : leaveRequestId , name : "user"});
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <EmployeeHeader heading="Leave Page" />

        {/* Leave Types Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Types of leaves Available:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 ">
            {leaveTypes?.leaveBalances?.map((leave) => (
              <Card key={leave.leaveTypeName} className="text-center ">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">{leave.leaveTypeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-2xl font-bold text-gray-900 bg-gray-500 py-2 rounded-md"
                  >
                    {leave.totalDays ? `${leave.availableDays}/${leave.totalDays}` : leave.usedDays}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leave History Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
            <div className="mb-4">
              <Button onClick={() => setOpenModal(true)} className="bg-blue-600 text-white">
                Apply for Leave
              </Button>
              
            </div>
            <AddLeaveRequestModal open={openModal} onClose={() => setOpenModal(false)} onAdd={handleLeaveAdd} />
          </div>
          <Card className="shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600">Leave Type</TableHead>
                    <TableHead className="text-gray-600">Start Date</TableHead>
                    <TableHead className="text-gray-600">End Date</TableHead>
                    <TableHead className="text-gray-600">Reason</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveHistory.length > 0 ? leaveHistory?.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell>{leave.leaveTypeId.name}</TableCell>
                      <TableCell>{leave.startDate}</TableCell>
                      <TableCell>{leave.endDate}</TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${leave.status === "Accepted"
                            ? "bg-green-100 text-green-600"
                            : leave.status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                            }`}
                        >
                          {leave.status}
                        </span>
                      </TableCell>
                      {leave.status === "Pending" ? <TableCell>
                        <div className="flex space-x-2">
                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Eye size={16} />
                          </Button> */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(leave._id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </TableCell> : ""}
                    </TableRow>
                  )): <p>No leave requests</p>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmDeleteModal
        onConfirm={async (leaveRequestId : string) => {
          try {
            const response = await deleteLeaveRequest(leaveRequestId);
            enqueueSnackbar(response.message, { variant: "success" })
            const newLeaveHistory = leaveHistory?.filter((lh)=>{
              return lh._id !== leaveRequestId
            })
            setLeaveHistory(newLeaveHistory);
          } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
              enqueueSnackbar(error?.response?.data.message, { variant: "error" });
            }
          }
        }}
      />
    </div>
  );
};

export default LeavePage;