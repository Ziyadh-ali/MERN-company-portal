import { container } from "tsyringe";
import { JwtService } from "../../adapters/service/jwt.service";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { UserLoginUseCase } from "../../useCases/user/userLoginUseCase";
import { AdminAuthUseCase } from "../../useCases/admin/AdminAuthUseCase";
import { UserProfileUseCase } from "../../useCases/common/UserProfileUseCase";
import { UserManagementUseCase } from "../../useCases/common/UserManagementUseCase";
import { RefreshTokenUseCase } from "../../useCases/common/RefreshTokenUseCase";
import { LeaveTypeUseCase } from "../../useCases/LeaveTypeUseCase";
import { LeaveBalanceUseCase } from "../../useCases/LeaveBalanceUseCase";
import { LeaveRequestUseCase } from "../../useCases/LeaveRequestUseCase";


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
        });

        container.register("IUserProfileUseCase",{
            useClass : UserProfileUseCase,
        });

        container.register("IUserManagementUseCase",{
            useClass : UserManagementUseCase,
        });

        container.register("IUserLoginUseCase",{
            useClass : UserLoginUseCase,
        });

        container.register("IRefreshTokenUseCase", {
            useClass : RefreshTokenUseCase,
        });

        container.register("ILeaveTypeUseCase",{
            useClass : LeaveTypeUseCase,
        });

        container.register("ILeaveBalanceUseCase",{
            useClass : LeaveBalanceUseCase,
        });

        container.register("ILeaveRequestUseCase" ,{
            useClass : LeaveRequestUseCase,
        });
    }
}