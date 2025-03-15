import express , { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { AdminRoute } from "../routes/adminRoutes";
import cookieParser from "cookie-parser";

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
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private configureRoutes() : void {
        const adminRoute = new AdminRoute();
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