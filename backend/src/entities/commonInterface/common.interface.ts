import { User } from "../models/userEntities/user.enitity";


export interface ICommonUseCase { 
    addUser(data : User) : Promise<User>;
    getUsers(
        filter : any ,
        page : number,
        pageSize : number,
    ) : Promise<{
        users : User[] | [];
        total : number;
        active : number;
        inactive : number;
    }>;

    getUserDetails(id : string) : Promise<User | null>;

    deleteUser(id : string) : Promise<void>;

    updateUser(userId : string,data : Partial<User>) : Promise<User | null>;

    getManagers() : Promise<User[] | []>;
}