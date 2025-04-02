import { User } from "../../models/userEntities/user.enitity";
export interface IUserRepository {
    save(data : Partial<User>) : Promise<User>
    findByEmail(email : string): Promise<User | null>
    find(
        filter : any,
        skip : number,
        limit : number,
    ) : Promise<{ users : User[] | []; total : number , active : number; inactive : number}>;
    findByIdAndDelete(id : any) : Promise<void>;
    updateUserById(
        id : any,
        data : Partial<User>,
    ) : Promise<User | null>;
    findById(id : string) : Promise<User | null>;
    findManagers() : Promise<User[] | []>;
}