import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { RefreshController } from "../../adapters/controllers/refreshController";
import { DependencyInjection } from "./index";
import { AdminUserManagement } from "../../adapters/controllers/admin/AdminUserManagement";
import { EmployeeController } from "../../adapters/controllers/employee/employeeController";
import { EmployeeProfile } from "../../adapters/controllers/employee/employeeProfileController";
import { LeaveTypeController } from "../../adapters/controllers/LeaveTypeController";
import { LeaveBalanceUseCase } from "../../useCases/LeaveBalanceUseCase";
import { LeaveTypeRepository } from "../../adapters/repositories/LeaveTypeRepository";
import { LeaveBalanceController } from "../../adapters/controllers/LeaveBalanceController";
import { LeaveRequestController } from "../../adapters/controllers/LeaveRequestController";
import { ForgotPasswordController } from "../../adapters/controllers/employee/ForgotPasswordController";
import { ResetPasswordController } from "../../adapters/controllers/employee/ResetPasswordController";
import { AttendanceController } from "../../adapters/controllers/AttendanceController";
import { MeetingController } from "../../adapters/controllers/MeetingController";

DependencyInjection.registerAll();

export const adminController = container.resolve(AdminController);

export const refreshController = container.resolve(RefreshController);

export const adminUserManagement = container.resolve(AdminUserManagement);

export const employeeController = container.resolve(EmployeeController);

export const employeeProfile = container.resolve(EmployeeProfile);

export const leaveTypeController = container.resolve(LeaveTypeController);

export const leaveBalanceUseCase = container.resolve(LeaveBalanceUseCase);

export const leaveTypeRepository = container.resolve(LeaveTypeRepository);

export const leaveBalanceController = container.resolve(LeaveBalanceController);

export const leaveRequestController = container.resolve(LeaveRequestController);

export const forgotPasswordController = container.resolve(ForgotPasswordController);

export const resetPasswordController = container.resolve(ResetPasswordController);

export const attendanceController = container.resolve(AttendanceController);

export const meetingController = container.resolve(MeetingController);