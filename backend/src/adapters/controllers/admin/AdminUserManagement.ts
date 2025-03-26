import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES } from "../../../shared/constants";
import { IUserManagementUseCase } from "../../../entities/useCaseInterface/IUserManagementUseCase";
import { IUserProfileUseCase } from "../../../entities/useCaseInterface/IUserProfileUseCase";

@injectable()
export class AdminUserManagement {
    constructor(
        @inject("IUserManagementUseCase") private userManagementUseCase: IUserManagementUseCase,
        @inject("IUserProfileUseCase") private userProfileUseCase: IUserProfileUseCase,
    ) { }

    async addUser(req: Request, res: Response): Promise<void> {
        const { userData } = req.body;
        try {
            const response = await this.userManagementUseCase.addUser(userData);

            res.status(HTTP_STATUS_CODES.CREATED).json({ response, message: "User added successfully" });
        } catch (error) {
            console.log("error adding user", error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : "An unknown error occurred"
            });
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, pageSize = 10, role, status, department, search } = req.query;
            const filter = {
                role: role !== "all" ? role : undefined,
                status: status !== "all" ? status : undefined,
                department: department !== "all" ? department : undefined,
                fullName: search ? { $regex: search, $options: "i" } : undefined,
            };


            const result = await this.userManagementUseCase.getUsers(
                filter,
                Number(page),
                Number(pageSize),
            );

            res
                .status(HTTP_STATUS_CODES.OK)
                .json({
                    success: true,
                    data: result.users,
                    total: result.total,
                    active : result.active,
                    inactive : result.inactive,
                    page: Number(page),
                    pageSize: Number(pageSize)
                });
        } catch (error) {
            console.log("Failed to fetch users", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch users",
            });
        }
    }

    async getUserDetails(req : Request , res : Response) : Promise<void> {
        try {
            const {userId} = req.params;

            const userDetails = await this.userProfileUseCase.getUserDetails(userId);
            
            res.status(HTTP_STATUS_CODES.OK).json({user : userDetails});
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message : "Error fetching details"});
        }
    }

    async deleteUser(req : Request , res : Response) : Promise<void> {
        try {
            const { userId} = req.params;
            await this.userManagementUseCase.deleteUser(userId);
            res.status(HTTP_STATUS_CODES.OK).json({message : "User Deleted"});
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message : "Error deleting user"});
        }
    }

    async getManagers(req : Request , res : Response) : Promise<void> {
        try {
            const response = await this.userManagementUseCase.getManagers();
            res.status(HTTP_STATUS_CODES.OK).json({
                success : true,
                message : "Managers found",
                managers : response,
            })
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : "An unknown error occurred"
            });
        }
    }

    async updateprofile(req: Request, res: Response): Promise<void> {
            const { userId } = req.params;
            const userData = req.body;
            try {
                if (!userId) {
                    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                        success: false,
                        message: "User id not provided",
                    })
                }
    
                if (!userData) {
                    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                        success: false,
                        message: "User data not provided",
                    });
                }
    
                const user = await this.userProfileUseCase.updateUser(userId, userData);
                if (user) {
                    res.status(HTTP_STATUS_CODES.OK).json({
                        success: true,
                        message: "User details updated",
                        newData: user,
                    });
                }
            } catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                        success: false,
                        message: error.message,
                    });
                } else {
                    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Error in updating",
                    });
                }
            }
        }
}