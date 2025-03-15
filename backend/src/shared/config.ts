import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    URL: process.env.MONGO_URI || "",
    NODE_ENV : process.env.NODE_ENV || "develpment",

    jwt: {
        ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY || "your-secret-key",
        REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY || "your-refresh-key",
        ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN || "",
        REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || "",
    }

}