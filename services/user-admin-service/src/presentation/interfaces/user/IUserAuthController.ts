import { Request, Response, NextFunction } from 'express';

export interface IUserAuthController {
  //Registration & login
  startRegister(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  loginUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  googleAuthUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  // Password management
  forgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  // changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  // Tokens & logout
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  logoutUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;

  // Account Updates / Identity Management
  changeEmail?(req: Request, res: Response, next: NextFunction): Promise<Response | void>; 
  changePhoneNumber?(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
