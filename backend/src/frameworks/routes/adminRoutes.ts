import express, { Request, Response } from 'express';
import {
  adminController,
  refreshController,
  adminUserManagement,
} from '../di/resolver';
import { verifyAuth } from '../../adapters/middlewares/authMiddleware';

export class AdminRoute {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post(
      '/login',
      (req: Request, res: Response) => adminController.login(req, res)
    );

    this.router.post(
      '/register',
      (req: Request, res: Response) => adminController.save(req, res)
    );

    this.router.post(
      '/logout',
      (req: Request, res: Response) => adminController.logout(req, res)
    );

    this.router.post(
      '/refresh-token/:role',
      (req: Request, res: Response) => refreshController.refreshToken(req, res)
    );

    this.router
      .post(
        '/users',
        verifyAuth("admin"),
        (req: Request, res: Response) => adminUserManagement.addUser(req, res)
      )
      .get(
        "/users",
        verifyAuth("admin"),
        (req: Request, res: Response) => adminUserManagement.getUsers(req, res)
      )
      .get(
        "/users/:userId",
        verifyAuth("admin"),
        (req: Request, res: Response) => adminUserManagement.getUserDetails(req, res)
      )
      .patch(
        "/users/:userId",
        verifyAuth("admin"),
        (req: Request, res: Response) => adminUserManagement.updateprofile(req, res)
      )
      .delete(
        "/users/:userId",
        verifyAuth("admin"),
        (req: Request, res: Response) => adminUserManagement.deleteUser(req, res)
      )

    this.router
      .get(
        "/managers",
        verifyAuth("admin"),
      (req: Request, res: Response) => adminUserManagement.getManagers(req, res))
      
  }

  public getRouter(): express.Router {
    return this.router;
  }
}