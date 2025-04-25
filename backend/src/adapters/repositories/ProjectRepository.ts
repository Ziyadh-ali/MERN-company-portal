import { injectable , inject } from "tsyringe";
import { IProjectRepository } from "../../entities/repositoryInterfaces/IProject.repository";
import { IProject } from "../../entities/models/Project.entities";
import { ProjectModel } from "../../frameworks/database/models/ProjectModal";

@injectable()
export class ProjectRepository implements IProjectRepository {
    async createProject(data: IProject): Promise<IProject> {
        return await ProjectModel.create(data);
    }

    async deleteProject(projectId: string): Promise<void> {
        await ProjectModel.findByIdAndDelete(projectId);
    }

    async updateProject(projectId : string ,updatedData: Partial<IProject>): Promise<IProject | null> {  
        return ProjectModel.findByIdAndUpdate(projectId,updatedData)
    }

    async findById(projectId: string): Promise<IProject | null> {
        return ProjectModel.findById(projectId);
    }

    async findProjects(): Promise<IProject[] | []> {
        return ProjectModel.find().populate("members" , "fullName");
    }
}