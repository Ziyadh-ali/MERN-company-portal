import express , {Request , Response } from "express";
import { userController, userProfile  , refreshController} from "../di/resolver";
import { verifyAuth } from "../../adapters/middlewares/authMiddleware";
import upload from "../../adapters/service/multer";


export class UserRoute {
    private router : express.Router;

    constructor(){
        this.router = express.Router()
        this.setRoutes();
    }

    private setRoutes() : void {
        this.router.post(
            "/login",
            (req : Request , res : Response) => userController.login(req , res),
        );

        this.router.post(
            "/logout",
            (req : Request , res : Response) => userController.logout(req , res),
        );
        this.router.post(
              '/refresh-token/:role',
              (req: Request, res: Response) => refreshController.refreshToken(req, res)
        );

        this.router
            .get(
                "/profile/:userId",
                verifyAuth("user"),
                (req : Request , res : Response) => userProfile.getProfileDetails(req , res),
            )
            .patch(
                "/profile/:userId",
                verifyAuth("user"),
                upload.single("profilePic"),
                (req : Request , res : Response) => userProfile.updateprofile(req , res),
            )
    }

    public getRoute() : express.Router {
        return this.router;
    }
}