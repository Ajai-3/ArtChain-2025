import { Request, Response, NextFunction } from 'express';

export interface ISecurityController {
    changePassword: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    changeEmail: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    emailVerifyToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
    deactivateAccount: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
