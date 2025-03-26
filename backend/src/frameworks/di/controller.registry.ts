import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { RefreshController } from "../../adapters/controllers/refreshController";
import { AdminUserManagement } from "../../adapters/controllers/admin/AdminUserManagement";
import { UserController } from "../../adapters/controllers/user/userController";
import { UserProfile } from "../../adapters/controllers/user/userProfileController";

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
        
        container.register("UserController", {
            useClass : UserController,
        });
        
        container.register("IUserProfile", {
            useClass : UserProfile,
        })
    }
}