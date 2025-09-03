import { Request, Response, NextFunction } from 'express';

export interface ISecurityController {
    changePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    changeEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    emailVerifyToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deactivateAccount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
