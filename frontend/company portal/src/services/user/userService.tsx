import { employeeAxiosInstance } from "../../api/employee.axios";


export const loginService = async (data : {
    email : string,
    password : string,
}) => {
    const response = await employeeAxiosInstance.post("/login",data);
    return response.data;
}

export const logoutService = async () => {
    const response = await employeeAxiosInstance.post("/logout");
    return response.data;
}

export const getProfileDetails = async (userId : string) => {
    const response = await employeeAxiosInstance.get(`/profile/${userId}`);
    return response.data;
}

export const updateProfileService = async (userId: string, formData: FormData) => {
    try {
      const response = await employeeAxiosInstance.patch(`profile/${userId}`, formData,{
        headers: { "Content-Type": "multipart/form-data" },
    });
      return response.data;
    } catch (error) {
      throw error;
    }
  };