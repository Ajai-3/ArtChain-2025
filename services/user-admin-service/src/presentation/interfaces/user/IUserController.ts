import { Request, Response, NextFunction } from 'express';

export interface IUserController {
  // Profile Management
  getProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getUserProfileWithId(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  updateProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  // Suppoters & Supporting 
  supportUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  unSupportUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getSupporters(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getSupporing(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getAllUserWithIds(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
