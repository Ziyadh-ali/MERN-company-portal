import { container } from "tsyringe";
import { AdminRepository } from "../../adapters/repositories/admin/AdminRepository";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin.repository";

export class RepositoryRegistry {
    static registerRepositories() : void {
        container.register("IAdminRepository",{
            useClass : AdminRepository,
        })
    }
}