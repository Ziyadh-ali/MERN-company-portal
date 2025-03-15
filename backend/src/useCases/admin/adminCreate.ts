import { injectable , inject } from "tsyringe";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin.repository";
import { Admin } from "../../entities/models/adminEntities/admin.enitity";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";

@injectable()
export class CreateAdmin {
    constructor(
        @inject("IAdminRepository") private adminRepository : IAdminRepository,
        @inject("PasswordBcrypt") private passwordBcrypt : PasswordBcrypt,
    ){}

    async execute(email : string , password : string) : Promise<Admin> {
        try {
            const existingAdmin = await this.adminRepository.findByEmail(email);
            if(existingAdmin){
                throw new Error("Admin already exists");
            }

            const hashedPassword = await this.passwordBcrypt.hash(password);

            const admin : Admin = {
                email,
                password : hashedPassword,
                role : "admin"
            };
            await this.adminRepository.save(admin);
            return admin;
        } catch (error) {
            throw new Error(`Failed to create admin : ${error}`);
        }
    }
}