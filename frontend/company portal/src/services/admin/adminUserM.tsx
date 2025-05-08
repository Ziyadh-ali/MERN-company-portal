import { adminAxiosInstance } from "../../api/admin.axios";

export const adminLoginService = async (data: { email: string, password: string }) => {
    const response = await adminAxiosInstance.post("/login", data);
    return response.data;
}

export const addUser = async (userData: {
    fullName: string;
    email: string;
    role: string;
    department: string;
    password: string;
}) => {
    const response = await adminAxiosInstance.post("/users", { userData });
    return response.data;
}

interface EmployeeFilter {
    role?: string;
    status?: string;
    department?: string;
    [key: string]: string | undefined;
}
export const getUsers = async (
    filter: EmployeeFilter,
    page: number,
    pageSize: number,
) => {
    const response = await adminAxiosInstance.get(`/users?page=${page}&pageSize=${pageSize}`, {
        params: { ...filter }
    });
    return response.data;
}

export const getUserDetails = async (id: string) => {
    const response = await adminAxiosInstance.get(`/users/${id}`);
    return response.data;
}

export const deleteUser = async (id: string) => {
    const response = await adminAxiosInstance.delete(`/users/${id}`);
    return response.data;
}

export const getManagers = async () => {
    const response = await adminAxiosInstance.get("/managers");
    return response.data;
}

export const updateUserService = async (userId: string, formData: FormData) => {
    const response = await adminAxiosInstance.patch(`/users/${userId}`, formData);
    return response.data;

}

export const getLeaveTypesService = async () => {
    const response = await adminAxiosInstance.get("/leave/type");
    return response.data;

}

export const deleteLeaveTypeService = async (id: string) => {
    const response = await adminAxiosInstance.delete(`/leave/type/${id}`);
    return response.data;
}

export const createLeaveTypeService = async (
    data: {
        name: string;
        description?: string;
        maxDaysAllowed: number;
        isPaid?: boolean;
        requiresApproval?: boolean;
    }
) => {
    const response = await adminAxiosInstance.post(`/leave/type`, data);
    return response.data;
}
export const updateLeaveTypeService = async (
    id: string,
    data: {
        name?: string;
        description?: string;
        maxDaysAllowed?: number;
        isPaidLeave?: boolean;
        requiresApproval?: boolean;
    }
) => {
    const response = await adminAxiosInstance.patch(`/leave/type/${id}`, data);
    return response.data;
}

export const getAllLeaveRequestsService = async () => {
    const response = await adminAxiosInstance.get("/leave/requests");
    return response.data;
}

export const updateLeaveRequestStatusService = async (leaveRequestId: string, status: "Approved" | "Rejected", reason?: string) => {
    const response = await adminAxiosInstance.patch(`/leave/requests/${leaveRequestId}`, {
        status,
        reason
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }
    );
    return response.data;
}

export const getAllAttendanceService = async (
    date: string | number,
    page: number,
    pageSize: number
) => {
    const queryDate = typeof date === "number" ? new Date(date).toISOString().split("T")[0] : date;
    const response = await adminAxiosInstance.get(
        `/attendance?date=${queryDate}&page=${page}&pageSize=${pageSize}`
    );
    return response.data;
};

export const updateAttendanceService = async (attendanceId: string, status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending") => {
    const response = await adminAxiosInstance.patch(`/attendance/${attendanceId}?status=${status}`);
    return response.data;
}

export const regularizeStatusService = async (attendanceId: string, action: "Approved" | "Rejected", remarks: string) => {
    const response = await adminAxiosInstance.patch(`/attendance/${attendanceId}/regularize?action=${action}`, { remarks });
    return response.data;
}

export const getQuestionsForAdminService = async () => {
    const response = await adminAxiosInstance.get("/question");
    return response.data;
}

export const answerAdminQuestionService = async (questionId: string, answer: string) => {
  const response = await adminAxiosInstance.patch(`/question/${questionId}`, { answer });
  return response.data;
}