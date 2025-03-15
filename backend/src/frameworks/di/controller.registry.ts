import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { AdminRefreshController } from "../../adapters/controllers/admin/AdminRefreshController";
import { AdminRefresh } from "../../adapters/controllers/admin/adminRefresh";

export class ControllerRegistry {
    static registerControllers() : void {
        container.register("AdminController", {
            useClass : AdminController,
        });

        container.register("AdminRefreshController" , {
            useClass : AdminRefreshController,
        });

        container.register("AdminRefresh" , {
            useClass : AdminRefresh,
        });
    }
}