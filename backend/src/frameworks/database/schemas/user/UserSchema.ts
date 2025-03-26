import { Schema } from "mongoose";
import { IUserModel } from "../../models/user/UserModel";

export const UserSchema = new Schema<IUserModel>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, },
        password: { type: String, required: true },
        role: { type: String, enum: ["hr", "projectManager", "developer"] },
        department: { type: String, required: true },
        status : { type: String, default : "active"},
        profilePic : { type: String,default : ""},
        phone : { type: Number, default : 1234567890},
        address : { type: String, default : ""},
        manager : { type: String , default : ""},
        joinedAt : { type: Date, default: Date.now() },
    },
    {
        timestamps: true
    }
);