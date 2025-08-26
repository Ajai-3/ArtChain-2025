import { Request, Response, NextFunction } from "express";

export interface IUserElasticController {
  indexUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  searchUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  adminSearchUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
}
