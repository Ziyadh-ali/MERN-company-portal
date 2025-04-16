import {z} from "zod";

export const loginSchema = z.object({
    email : z.string().email("Inavlid email address"),
    passwrod : z.string().min(6,"Password must be at least 6 characters"),
});