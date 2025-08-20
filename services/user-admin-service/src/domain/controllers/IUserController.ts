import { Request, Response, NextFunction } from "express";

export interface IUserController {
  getUserProfile(req: Request, res: Response, next: NextFunction): Promise<any>;
  getUserProfileWithId(req: Request, res: Response, next: NextFunction): Promise<any>;
  supportUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  unSupportUser(req: Request, res: Response, next: NextFunction): Promise<any>;
  getSupporters(req: Request, res: Response, next: NextFunction): Promise<any>;
}
