import { container } from "tsyringe";
import { JwtService } from "../../adapters/service/jwt.service";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { UserLogin } from "../../useCases/user/userLoginUseCase";
import { AdminAuthUseCase } from "../../useCases/admin/AdminAuthUseCase";
import { UserProfileUseCase } from "../../useCases/common/UserProfileUseCase";
import { UserManagementUseCase } from "../../useCases/common/UserManagementUseCase";


export class UseCaseRegistry {
    static registerUseCases(): void {
        container.register("IAdminAuthUseCase", {
            useClass: AdminAuthUseCase,
        });

        container.register("JwtService", {
            useClass: JwtService,
        });

        container.register("PasswordBcrypt", {
            useClass: PasswordBcrypt,
        })

        container.register("IUserProfileUseCase",{
            useClass : UserProfileUseCase,
        })

        container.register("IUserManagementUseCase",{
            useClass : UserManagementUseCase,
        })

        container.register("UserLogin",{
            useClass : UserLogin,
        })
    }
}