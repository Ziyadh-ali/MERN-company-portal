import { inject , injectable } from "tsyringe";
import { IUserRepository } from "../../entities/repositoryInterfaces/user/user.repository";
import { User } from "../../entities/models/userEntities/user.enitity";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";
import { IUserProfileUseCase } from "../../entities/useCaseInterface/IUserProfileUseCase";

@injectable()
export class UserProfileUseCase implements IUserProfileUseCase {
    constructor(
        @inject("IUserRepository") private userRepository : IUserRepository,
    ) {}

    async updateUser(userId : string ,data : Partial<User>) : Promise<User | null> {
        try {
            const updateUser = this.userRepository.updateUserById(userId , data);
            if(!updateUser){
                throw new Error("User not found");
            }
            return updateUser;
        } catch (error) {
            throw new Error("Error in updating user");
        }
    }

    async getUserDetails(id : string) : Promise<User | null> {
        return await this.userRepository.findById(id)
    }
}