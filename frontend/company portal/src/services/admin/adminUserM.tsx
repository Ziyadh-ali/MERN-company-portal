import { adminAxiosInstance } from "../../api/admin.axios";

export const addUser = async (userData : {
    fullName: string;
    email: string;
    role: string;
    department: string;
    password: string;
}) => {
    const response = await adminAxiosInstance.post("/users",{userData});
    return response.data;
}

export const getUsers = async (
    filter:any,
    page : number,
    pageSize : number,
) => {
    const response = await adminAxiosInstance.get(`/users?page=${page}&pageSize=${pageSize}`,{
        params : {...filter}
    });
    return response.data;
}

export const getUserDetails = async (id : string ) => {
    const response = await adminAxiosInstance.get(`/users/${id}`);
    return response.data;
}

export const deleteUser = async (id : string) => {
    const response = await adminAxiosInstance.delete(`/users/${id}`);
    return response.data;
}

export const getManagers = async () => {
    const response = await adminAxiosInstance.get("/managers");
    return response.data;
}

export const updateUserService = async (userId: string, formData: FormData) => {
    try {
      const response = await adminAxiosInstance.patch(`users/${userId}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };