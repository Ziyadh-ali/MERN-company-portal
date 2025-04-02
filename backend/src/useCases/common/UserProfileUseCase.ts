import { inject , injectable } from "tsyringe";
import { IUserRepository } from "../../entities/repositoryInterfaces/user/user.repository";
import { User } from "../../entities/models/userEntities/user.enitity";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";
import { IUserProfileUseCase } from "../../entities/useCaseInterface/IUserProfileUseCase";
import { MESSAGES } from "../../shared/constants";

@injectable()
export class UserProfileUseCase implements IUserProfileUseCase {
    constructor(
        @inject("IUserRepository") private userRepository : IUserRepository,
        @inject("PasswordBcrypt") private passwordBcrypt : PasswordBcrypt,
    ) {}

    async updateUser(userId : string ,data : Partial<User>) : Promise<User | null> {
        try {
            const updateUser = await this.userRepository.updateUserById(userId , data);
            if(!updateUser){
                throw new Error(MESSAGES.ERROR.USER.USER_NOT_FOUND);
            }
            return updateUser;
        } catch (error) {
            throw new Error(MESSAGES.ERROR.USER.USER_UPDATE_FAILED);
        }
    }

    async getUserDetails(id : string) : Promise<User | null> {
        return await this.userRepository.findById(id)
    }

    async changePassword(userId: string, data: { currentPassword: string; newPassword: string; }): Promise<void> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error(MESSAGES.ERROR.USER.USER_NOT_FOUND);
            }

            if (!data?.currentPassword || !data?.newPassword) {
                throw new Error(MESSAGES.ERROR.USER.PASSWORD_REQUIRED);
            }

            const isPasswordValid = await this.passwordBcrypt.compare(data.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new Error(MESSAGES.ERROR.USER.INVALID_CURRENT_PASSWORD);
            }

            const hashedPassword = await this.passwordBcrypt.hash(data.newPassword);
            const passwordChange = await this.userRepository.updateUserById(userId, { password: hashedPassword });

            if (!passwordChange) {
                throw new Error(MESSAGES.ERROR.USER.PASSWORD_UPDATE_FAILED);
            }

            return;
        } catch (error) {
            throw error
        }
    }
}