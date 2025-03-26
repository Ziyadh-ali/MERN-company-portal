import { injectable , inject } from "tsyringe";
import { IUserRepository } from "../../entities/repositoryInterfaces/user/user.repository";
import { JwtService } from "../../adapters/service/jwt.service";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";
import { UserLoginResponse  } from "../../entities/userInterface/userLogin.interface";

@injectable()
export class UserLogin {
    constructor(
        @inject("IUserRepository") private userRepository : IUserRepository,
        @inject("PasswordBcrypt") private passWordBcrypt : PasswordBcrypt,
        @inject("JwtService") private jwtService : JwtService,
    ) {}

    async execute (email : string , password : string) : Promise<UserLoginResponse | null> {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new Error("User Not Found");
        }

        if(password){
            const isPasswordMatch = await this.passWordBcrypt.compare(password,user.password);
            if (!isPasswordMatch) {
                throw new Error("Invalid credentials");
            }
        }

        const userData = {
            id : user._id,
            email : user.email,
            role : user.role,
        }

        const accessToken = this.jwtService.generateAccessToken(userData);

        const refreshToken = this.jwtService.generateRefreshToken(userData);

        return {
            accessToken,
            refreshToken,
            user : {
                _id : user._id,
                email : user.email,
                fullName : user.fullName,
                role : user.role,
                profilePic : user.profilePic,
            }
        }
    }
}