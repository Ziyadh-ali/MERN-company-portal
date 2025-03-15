import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { AdminRefreshController } from "../../adapters/controllers/admin/AdminRefreshController";
import { AdminRefresh } from "../../adapters/controllers/admin/adminRefresh";
import { DependencyInjection } from "./index";

DependencyInjection.registerAll()

export const adminController = container.resolve(AdminController);

export const adminRefreshController = container.resolve(AdminRefreshController);

export const adminRefresh = container.resolve(AdminRefresh);