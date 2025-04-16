import { Employee } from "../../models/employeeEntities/employee.enitity";
export interface IEmployeeRepository {
    save(data : Partial<Employee>) : Promise<Employee>
    findByEmail(email : string): Promise<Employee | null>
    find(
        filter : any,
        skip : number,
        limit : number,
    ) : Promise<{ employees : Employee[] | []; total : number , active : number; inactive : number}>;
    findByIdAndDelete(id : any) : Promise<void>;
    updateEmployeeById(
        id : any,
        data : Partial<Employee>,
    ) : Promise<Employee | null>;
    findById(id : string) : Promise<Employee | null>;
    findManagers() : Promise<Employee[] | []>;
    getParticipantsByFilter(filter : {
        role ?: string , 
        department ?: string,
    }) : Promise <string[]>;
}