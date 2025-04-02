import { container } from "tsyringe";
import { AdminRepository } from "../../adapters/repositories/admin/AdminRepository";
import { UserRepository } from "../../adapters/repositories/user/UserRepository";
import { LeaveTypeRepository } from "../../adapters/repositories/LeaveTypeRepository";
import { LeaveBalanceRepository } from "../../adapters/repositories/LeaveBalanceRepository";
import { LeaveRequestRepository } from "../../adapters/repositories/LeaveRequestRepository";


export class RepositoryRegistry {
    static registerRepositories() : void {
        container.register("IAdminRepository",{
            useClass : AdminRepository,
        });

        container.register("IUserRepository",{
            useClass : UserRepository,
        });

        container.register("ILeaveTypeRepository",{
            useClass : LeaveTypeRepository,
        });

        container.register("ILeaveBalanceRepository" ,{
            useClass : LeaveBalanceRepository,
        });

        container.register("ILeaveRequestRepository",{
            useClass : LeaveRequestRepository,
        });
    }
}