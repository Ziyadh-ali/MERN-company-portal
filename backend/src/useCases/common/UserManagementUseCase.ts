import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../entities/repositoryInterfaces/user/user.repository";
import { User } from "../../entities/models/userEntities/user.enitity";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";
import { IUserManagementUseCase } from "../../entities/useCaseInterface/IUserManagementUseCase";
import { MESSAGES } from "../../shared/constants";
import { eventHandler } from "../../shared/eventHandler";

@injectable()
export class UserManagementUseCase implements IUserManagementUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("PasswordBcrypt") private passwordBcrypt: PasswordBcrypt,
    ) { }

    async addUser(data: User): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error(MESSAGES.ERROR.USER.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await this.passwordBcrypt.hash(data.password);
        const newUser: User = { ...data, password: hashedPassword };

        const createUser = await this.userRepository.save(newUser);


        eventHandler.emit("USER_CREATED", createUser._id?.toString());

        return createUser;
    }

    async getUsers(filter: any, page: number, pageSize: number): Promise<{ users: User[] | []; total: number, active: number, inactive: number }> {
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        return await this.userRepository.find(filter, skip, limit);
    }

    async deleteUser(id: string): Promise<void> {
        try {
            eventHandler.emit("USER_DELETED",id);
            await this.userRepository.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error in deleting user")
        }
    }

    async getManagers(): Promise<User[] | []> {
        try {
            const managers = await this.userRepository.findManagers();
            return managers;
        } catch (error) {
            console.log(error);
            throw new Error("Error in finding managers");
        }
    }
} 