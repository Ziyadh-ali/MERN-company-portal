import express from 'express';
import { adminController, adminRefresh, adminRefreshController } from '../di/resolver';

export class AdminRoute {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post('/login', adminController.login.bind(adminController));
    this.router.post('/register', adminController.save.bind(adminController));
    this.router.post('/logout', adminController.logout.bind(adminController));
    this.router.post('/refresh-token', adminController.refreshToken.bind(adminController));
  }

  public getRouter(): express.Router {
    return this.router;
  }
}