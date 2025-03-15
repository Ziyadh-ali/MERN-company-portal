import { inject, injectable } from "tsyringe";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin.repository";
import { Admin } from "../../entities/models/adminEntities/admin.enitity";
import { JwtService } from "../../adapters/service/jwt.service";
import { AdminLoginResponse } from "../../entities/adminInterface/adminLogin.interface";
import { PasswordBcrypt } from "../../frameworks/security/password.bcrypt";

@injectable()
export class AdminLogin {
    constructor(
        @inject("IAdminRepository") private adminRepository: IAdminRepository,
        @inject("JwtService") private jwtService: JwtService,
        @inject("PasswordBcrypt") private passwordBcrypt: PasswordBcrypt,
    ) {}

    async execute(email: string, password: string): Promise<AdminLoginResponse | null> {
        const admin = await this.adminRepository.findByEmail(email);
        if (!admin) {
            throw new Error("Admin not found");
        }

        if (password) {
            const isPasswordMatch = await this.passwordBcrypt.compare(password, admin.password);
            if (!isPasswordMatch) {
                throw new Error("Invalid credentials");
            }
        }

        const accessToken = this.jwtService.generateAccessToken({
            id: admin._id || "",
            email: admin.email,
            role: admin.role,
        });

        const refreshToken = this.jwtService.generateRefreshToken({
            id: admin._id || "",
            email: admin.email,
            role: admin.role,
        })

        return {
            refreshToken,
            accessToken,
            admin: {
                _id: admin._id || "",
                name: admin.name,
                email: admin.email,
                role: admin.role,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
              }
        }
    }
}