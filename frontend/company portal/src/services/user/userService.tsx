import { employeeAxiosInstance } from "../../api/employee.axios";


export const loginService = async (data: {
  email: string,
  password: string,
}) => {
  const response = await employeeAxiosInstance.post("/login", data);
  return response.data;
}

export const logoutService = async () => {
  const response = await employeeAxiosInstance.post("/logout");
  return response.data;
}

export const getProfileDetails = async (userId: string) => {
  const response = await employeeAxiosInstance.get(`/profile/${userId}`);
  return response.data;
}

export const updateProfileService = async (userId: string, formData: FormData) => {
  try {
    const response = await employeeAxiosInstance.patch(`profile/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePasswordService = async (userId: string, currentPassword: string, newPassword: string) => {
  const response = await employeeAxiosInstance.patch(`profile/${userId}/password`, {
    currentPassword,
    newPassword,
  });

  return response.data;
}

export const getLeaveBalancesService = async (userId: string) => {
  try {
    const response = await employeeAxiosInstance.get(`/leave/balance/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getAllLeaveTypesService = async () => {
  try {
    const response = await employeeAxiosInstance.get("/leave/types");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addLeaveRequestService = async (data: {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}) => {
  try {
    const response = await employeeAxiosInstance.post("/leave/request", {
      data,
    })
    return response.data
  } catch (error) {
    throw error;
  }
}

export const getLeaveRequestsService = async (userId: string) => {
  try {
    const response = await employeeAxiosInstance.get(`/leave/request/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteLeaveRequest = async (leaveRequestId: string) => {
  try {
    const response = await employeeAxiosInstance.delete(`/leave/request/${leaveRequestId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}