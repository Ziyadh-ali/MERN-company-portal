import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { RefreshController } from "../../adapters/controllers/refreshController";
import { DependencyInjection } from "./index";
import { AdminUserManagement } from "../../adapters/controllers/admin/AdminUserManagement";
import { UserController } from "../../adapters/controllers/user/userController";
import { UserProfile } from "../../adapters/controllers/user/userProfileController";
import { LeaveTypeController } from "../../adapters/controllers/LeaveTypeController";
import { LeaveBalanceUseCase } from "../../useCases/LeaveBalanceUseCase";
import { LeaveTypeRepository } from "../../adapters/repositories/LeaveTypeRepository";
import { LeaveBalanceController } from "../../adapters/controllers/LeaveBalanceController";
import { LeaveRequestController } from "../../adapters/controllers/LeaveRequestController";

DependencyInjection.registerAll()

export const adminController = container.resolve(AdminController);

export const refreshController = container.resolve(RefreshController);

export const adminUserManagement = container.resolve(AdminUserManagement);

export const userController = container.resolve(UserController);

export const userProfile = container.resolve(UserProfile);

export const leaveTypeController = container.resolve(LeaveTypeController);

export const leaveBalanceUseCase = container.resolve(LeaveBalanceUseCase);

export const leaveTypeRepository = container.resolve(LeaveTypeRepository);

export const leaveBalanceController = container.resolve(LeaveBalanceController);

export const leaveRequestController = container.resolve(LeaveRequestController);