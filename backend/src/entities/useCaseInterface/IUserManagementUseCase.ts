import { User } from "../models/userEntities/user.enitity";


export interface IUserManagementUseCase {
    addUser(data: User): Promise<User>;

    getUsers(
        filter: any,
        page: number,
        pageSize: number
    ): Promise<{
        users: User[] | [];
        total: number;
        active: number;
        inactive: number,
    }>;

    deleteUser(userId : string) : Promise<void>;

    getManagers() : Promise<User[]>;
}