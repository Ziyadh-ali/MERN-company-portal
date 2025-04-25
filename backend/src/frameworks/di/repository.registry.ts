import { container } from "tsyringe";
import { AdminRepository } from "../../adapters/repositories/admin/AdminRepository";
import { EmployeeRepository } from "../../adapters/repositories/employee/EmployeeRepository";
import { LeaveTypeRepository } from "../../adapters/repositories/LeaveTypeRepository";
import { LeaveBalanceRepository } from "../../adapters/repositories/LeaveBalanceRepository";
import { LeaveRequestRepository } from "../../adapters/repositories/LeaveRequestRepository";
import { AttendanceRepository } from "../../adapters/repositories/AttendanceRepository";
import { MeetingRepository } from "../../adapters/repositories/MeetingRepository";
import { FaqRepository } from "../../adapters/repositories/FaqRepository";
import { MessageRepository } from "../../adapters/repositories/MessageRepository";
import { IAdminRepository } from "../../entities/repositoryInterfaces/admin/admin.repository";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/employee.repository";
import { ILeaveTypeRepository } from "../../entities/repositoryInterfaces/ILeaveType.repository";
import { ILeaveBalanceRepository } from "../../entities/repositoryInterfaces/ILeaveBalance.repository";
import { ILeaveRequestRepository } from "../../entities/repositoryInterfaces/ILeaveRequest.repository";
import { IAttendanceRepository } from "../../entities/repositoryInterfaces/IAttendance.repository";
import { IMeetingRepository } from "../../entities/repositoryInterfaces/IMeeting.repository";
import { IFaqRepository } from "../../entities/repositoryInterfaces/IFaq.respository";
import { IMessageRepository } from "../../entities/repositoryInterfaces/IMessage.respository";
import { IProjectRepository } from "../../entities/repositoryInterfaces/IProject.repository";
import { ProjectRepository } from "../../adapters/repositories/ProjectRepository";


export class RepositoryRegistry {
    static registerRepositories() : void {
        container.register<IAdminRepository>("IAdminRepository",{
            useClass : AdminRepository,
        });

        container.register<IEmployeeRepository>("IEmployeeRepository",{
            useClass : EmployeeRepository,
        });

        container.register<ILeaveTypeRepository>("ILeaveTypeRepository",{
            useClass : LeaveTypeRepository,
        });

        container.register<ILeaveBalanceRepository>("ILeaveBalanceRepository" ,{
            useClass : LeaveBalanceRepository,
        });

        container.register<ILeaveRequestRepository>("ILeaveRequestRepository",{
            useClass : LeaveRequestRepository,
        });
        
        container.register<IAttendanceRepository>("IAttendanceRepository",{
            useClass : AttendanceRepository,
        });

        container.register<IMeetingRepository>("IMeetingRepository",{
            useClass : MeetingRepository,
        });

        container.register<IFaqRepository>("IFaqRepository",{
            useClass : FaqRepository,
        });

        container.register<IMessageRepository>("IMessageRepository",{
            useClass : MessageRepository,
        });

        container.register<IProjectRepository>("IProjectRepository",{
            useClass : ProjectRepository,
        });
    }
}