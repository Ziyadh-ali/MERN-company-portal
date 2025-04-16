import { container } from "tsyringe";
import { JwtService } from "../../adapters/service/jwt.service";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { EmployeeLoginUseCase } from "../../useCases/employee/employeeLoginUseCase";
import { AdminAuthUseCase } from "../../useCases/admin/AdminAuthUseCase";
import { EmployeeProfileUseCase } from "../../useCases/common/EmployeeProfileUseCase";
import { EmployeeManagementUseCase } from "../../useCases/common/EmployeeManagementUseCase";
import { RefreshTokenUseCase } from "../../useCases/common/RefreshTokenUseCase";
import { LeaveTypeUseCase } from "../../useCases/LeaveTypeUseCase";
import { LeaveBalanceUseCase } from "../../useCases/LeaveBalanceUseCase";
import { LeaveRequestUseCase } from "../../useCases/LeaveRequestUseCase";
import { EmailService } from "../../adapters/service/mailer";
import { ForgotPasswordUseCase } from "../../useCases/employee/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../useCases/employee/ResetPasswordUseCase";
import { AttendanceUseCase } from "../../useCases/AttendanceUseCase";
import { MeetingUseCase } from "../../useCases/MeetingUseCase";


export class UseCaseRegistry {
    static registerUseCases(): void {
        container.register("IAdminAuthUseCase", {
            useClass: AdminAuthUseCase,
        });

        container.register("IJwtService", {
            useClass: JwtService,
        });

        container.register("IBcrypt", {
            useClass: PasswordBcrypt,
        });

        container.register("IEmployeeProfileUseCase",{
            useClass : EmployeeProfileUseCase,
        });

        container.register("IEmployeeManagementUseCase",{
            useClass : EmployeeManagementUseCase,
        });

        container.register("IEmployeeLoginUseCase",{
            useClass : EmployeeLoginUseCase,
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

        container.register("IEmailService",{
            useClass : EmailService,
        });

        container.register("IForgotPasswordUseCase",{
            useClass : ForgotPasswordUseCase,
        });

        container.register("IResetPasswordUseCase",{
            useClass : ResetPasswordUseCase
        });

        container.register("IAttendanceUseCase",{
            useClass : AttendanceUseCase
        });

        container.register("IMeetingUseCase",{
            useClass : MeetingUseCase,
        })
    }
}