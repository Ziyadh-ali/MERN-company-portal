import { container } from "tsyringe";
import { AdminRepository } from "../../adapters/repositories/admin/AdminRepository";
import { EmployeeRepository } from "../../adapters/repositories/employee/EmployeeRepository";
import { LeaveTypeRepository } from "../../adapters/repositories/LeaveTypeRepository";
import { LeaveBalanceRepository } from "../../adapters/repositories/LeaveBalanceRepository";
import { LeaveRequestRepository } from "../../adapters/repositories/LeaveRequestRepository";
import { AttendanceRepository } from "../../adapters/repositories/AttendanceRepository";
import { MeetingRepository } from "../../adapters/repositories/MeetingRepository";


export class RepositoryRegistry {
    static registerRepositories() : void {
        container.register("IAdminRepository",{
            useClass : AdminRepository,
        });

        container.register("IEmployeeRepository",{
            useClass : EmployeeRepository,
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
        
        container.register("IAttendanceRepository",{
            useClass : AttendanceRepository,
        });

        container.register("IMeetingRepository",{
            useClass : MeetingRepository,
        });
    }
}