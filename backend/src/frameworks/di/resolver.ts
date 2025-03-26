import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { RefreshController } from "../../adapters/controllers/refreshController";
import { DependencyInjection } from "./index";
import { AdminUserManagement } from "../../adapters/controllers/admin/AdminUserManagement";
import { UserController } from "../../adapters/controllers/user/userController";
import { UserProfile } from "../../adapters/controllers/user/userProfileController";

DependencyInjection.registerAll()

export const adminController = container.resolve(AdminController);

export const refreshController = container.resolve(RefreshController);

export const adminUserManagement = container.resolve(AdminUserManagement);

export const userController = container.resolve(UserController);

export const userProfile = container.resolve(UserProfile);