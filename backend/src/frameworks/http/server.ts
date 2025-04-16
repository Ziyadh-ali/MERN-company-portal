import express , { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { AdminRoute } from "../routes/adminRoutes";
import cookieParser from "cookie-parser";
import { config } from "../../shared/config";
import { UserRoute } from "../routes/employeeRoutes";

export class Server {
    private app : Application;
    private port : number;

    constructor(port : number){
        this.app = express();
        this.port = port;
        this.setupMiddlewares();
        this.configureRoutes();
    }

    private setupMiddlewares():void {
        this.app.use(morgan("dev"))
        this.app.use(
            cors({
              origin: config.cors.ALLOWED_ORIGIN,
              methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
              allowedHeaders: ["Authorization", "Content-Type"],
              credentials: true,
            })
          );
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private configureRoutes() : void {
        const adminRoute = new AdminRoute();
        const userRoute = new UserRoute()
        this.app.use("/",userRoute.getRoute());  
        this.app.use("/admin",adminRoute.getRouter());
    }

    public start():void {
        this.app.listen(this.port, ()=>{
            console.log(`Server running on http://localhost:${this.port}`)
        })
    }

    public getApp() : Application{
        return this.app;
    }
}