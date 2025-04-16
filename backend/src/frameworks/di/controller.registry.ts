import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { RefreshController } from "../../adapters/controllers/refreshController";
import { AdminUserManagement } from "../../adapters/controllers/admin/AdminUserManagement";
import { EmployeeController } from "../../adapters/controllers/employee/employeeController";
import { EmployeeProfile } from "../../adapters/controllers/employee/employeeProfileController";
import { LeaveTypeController } from "../../adapters/controllers/LeaveTypeController";
import { LeaveBalanceController } from "../../adapters/controllers/LeaveBalanceController";
import { LeaveRequestController } from "../../adapters/controllers/LeaveRequestController";
import { ForgotPasswordController } from "../../adapters/controllers/employee/ForgotPasswordController";
import { ResetPasswordController } from "../../adapters/controllers/employee/ResetPasswordController";
import { MeetingController } from "../../adapters/controllers/MeetingController";

export class ControllerRegistry {
    static registerControllers() : void {
        container.register("AdminController", {
            useClass : AdminController,
        });

        container.register("RefreshController" , {
            useClass : RefreshController,
        });

        container.register("AdminUserManagement",{
            useClass : AdminUserManagement,
        });
        
        container.register("EmployeeController", {
            useClass : EmployeeController,
        });
        
        container.register("IEmployeeProfile", {
            useClass : EmployeeProfile,
        });

        container.register("ILeaveTypeController", {
            useClass : LeaveTypeController,
        });

        container.register("LeaveBalanceController",{
            useClass : LeaveBalanceController,
        });

        container.register("LeaveRequestController",{
            useClass : LeaveRequestController,
        });

        container.register("ForgotPasswordController",{
            useClass : ForgotPasswordController,
        });

        container.register("ResetPasswordController" , {
            useClass : ResetPasswordController,
        });

        container.register("MeetingController",{
            useClass : MeetingController
        })
    }
}