import { Request, Response, NextFunction } from "express";

export interface IAdminAuthController {
  adminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  adminLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}
