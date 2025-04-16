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

export const updateLeaveRequestStatusService = async (leaveRequestId: string, status: "Approved" | "Rejected", userId: string) => {
    const response = await adminAxiosInstance.patch(`/leave/requests/${leaveRequestId}`, {
        status,
        userId
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }
    );
    return response.data;
}