import { User } from "../models/userEntities/user.enitity";


export interface IUserProfileUseCase {
    getUserDetails(userId : string) : Promise<User | null>;

    updateUser(userId : string , data : Partial<User>) : Promise<User | null>;
}