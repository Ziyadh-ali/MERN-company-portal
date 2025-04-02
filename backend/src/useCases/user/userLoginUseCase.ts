import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../entities/repositoryInterfaces/user/user.repository";
import { JwtService } from "../../adapters/service/jwt.service";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";
import { UserLoginResponse } from "../../entities/userInterface/userLogin.interface";
import { IUserLoginUseCase } from "../../entities/useCaseInterface/IUserLoginUseCase";
import { clearAuthCookies } from "../../shared/utils/cookieHelper";
import { Response } from "express";
import { MESSAGES } from "../../shared/constants";

@injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("PasswordBcrypt") private passWordBcrypt: PasswordBcrypt,
        @inject("JwtService") private jwtService: JwtService,
    ) { }

    async login(email: string, password: string): Promise<UserLoginResponse | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER.USER_NOT_FOUND);
        }

        if (password) {
            const isPasswordMatch = await this.passWordBcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new Error(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
            }
        }

        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
        }

        const accessToken = this.jwtService.generateAccessToken(userData);

        const refreshToken = this.jwtService.generateRefreshToken(userData);

        return {
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                profilePic: user.profilePic,
            }
        }
    }

    async logout(res : Response): Promise<void> {
        try {
            clearAuthCookies(
                res,
                "user_access_token",
                "user_refresh_token",
            );
        } catch (error) {
            throw new Error("error in login");
        }
    }
}