import { container } from "tsyringe";
import { AdminRepository } from "../../adapters/repositories/admin/AdminRepository";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin.repository";
import { IUserRepository } from "../../entities/repositoryInterfaces/user/user.repository";
import { UserRepository } from "../../adapters/repositories/user/UserRepository";


export class RepositoryRegistry {
    static registerRepositories() : void {
        container.register("IAdminRepository",{
            useClass : AdminRepository,
        });

        container.register("IUserRepository",{
            useClass : UserRepository,
        })
    }
}