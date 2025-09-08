import { Request, Response, NextFunction } from 'express';

export interface IUserController {
  // Profile Management
  getUserProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getUserProfileWithId(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  // Suppoters & Supporting 
  supportUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  unSupportUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getSupporters(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getSupporing(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
