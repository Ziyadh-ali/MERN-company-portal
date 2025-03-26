import { IUserRepository } from "../../../entities/repositoryInterfaces/user/user.repository";
import { injectable } from "tsyringe";
import { User } from "../../../entities/models/userEntities/user.enitity";
import { UserModel } from "../../../frameworks/database/models/user/UserModel";

@injectable()
export class UserRepository implements IUserRepository {
    async save(data: Partial<User>): Promise<User> {
        return await UserModel.create(data);
    }

    async find(filter: any, skip: number, limit: number): Promise<{ users: User[] | []; total: number; active : number; inactive : number}> {

        const query: any = {};
        
        if (filter.role) query.role = filter.role;
        if (filter.status) query.status = filter.status;
        if (filter.department) query.department = filter.department;
        if (filter.fullName) query.fullName = filter.fullName;

        const users = await UserModel.find(query).skip(skip).limit(limit).lean();
        const total = await UserModel.countDocuments(query);
        const active = await UserModel.countDocuments({...query,status : "active"});
        const inactive = await UserModel.countDocuments({...query,status : "inactive"});

        return {
            users,
            total,
            active,
            inactive,
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return await UserModel.findOne({ email });
    }

    async findByIdAndDelete(id: any): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }

    async updateUserById(id: any, data: Partial<User>): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, data);
    }

    async findById(id: string): Promise<User | null> {
        return await UserModel.findById(id);
    }
    
    async findManagers(): Promise<User[] | [] > {
        return await UserModel.find({ role: { $in: ["hr", "projectManager"] } });
    }
}    