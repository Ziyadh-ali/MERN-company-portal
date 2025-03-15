import { container } from "tsyringe";
import { AdminLogin } from "../../useCases/admin/adminLogin";
import { JwtService } from "../../adapters/service/jwt.service";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { CreateAdmin } from "../../useCases/admin/adminCreate";

export class UseCaseRegistry {
    static registerUseCases(): void {
        container.register("AdminLogin", {
            useClass: AdminLogin,
        });

        container.register("JwtService", {
            useClass: JwtService,
        });

        container.register("PasswordBcrypt", {
            useClass: PasswordBcrypt,
        })
        
        container.register("CreateAdmin" , {
            useClass : CreateAdmin,
        })
    }
}