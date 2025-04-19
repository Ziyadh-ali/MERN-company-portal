import { ObjectId } from "mongoose";
import { IFaqs } from "../models/IFaqs";

export interface IFaqUseCase {
    createFaq(data: IFaqs): Promise<IFaqs>;
    updateFaq(faqId: string | ObjectId, updatedData: Partial<IFaqs>): Promise<IFaqs>;
    find(
        search: string,
        page: number,
        pageSize: number,
    ): Promise<IFaqs[] | []>;
    findById(faqId: string | ObjectId): Promise<IFaqs>;
    deleteFaq(faqId: string | ObjectId): Promise<void>;
    
}