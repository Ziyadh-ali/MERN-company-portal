import express, { Application } from "express";
import morgan from "morgan";
import http from "http"
import cors from "cors";
import helmet from "helmet";
import { AdminRoute } from "../routes/adminRoutes";
import cookieParser from "cookie-parser";
import { config } from "../../shared/config";
import { UserRoute } from "../routes/employeeRoutes";
import { Server as IOServer } from "socket.io";
import { SocketManager } from "../../shared/socket/socketManager";

export class Server {
    private app: Application;
    private port: number;
    private server: http.Server;
    private io: IOServer;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.server = http.createServer(this.app);
        this.io = new IOServer(this.server, {
            cors: {
                origin: config.cors.ALLOWED_ORIGIN,
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                credentials: true,
            },
        })
        this.setupMiddlewares();
        this.configureRoutes();
        this.setupSocket();
    }

    private setupMiddlewares(): void {
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

    private configureRoutes(): void {
        const adminRoute = new AdminRoute();
        const userRoute = new UserRoute()
        this.app.use("/", userRoute.getRoute());
        this.app.use("/admin", adminRoute.getRouter());
    }

    private setupSocket() : void {
        const socketManager = new SocketManager(this.io);
        socketManager.handleConnections();
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`)
        })
    }

    public getApp(): Application {
        return this.app;
    }
}