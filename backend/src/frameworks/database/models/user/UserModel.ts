import { Document , model , ObjectId } from "mongoose";
import { User } from "../../../../entities/models/userEntities/user.enitity";
import { UserSchema } from "../../schemas/user/UserSchema";


export interface IUserModel extends Omit<User , "_id">,Document {
    _id : ObjectId;
}

export const UserModel = model<IUserModel>("User",UserSchema)