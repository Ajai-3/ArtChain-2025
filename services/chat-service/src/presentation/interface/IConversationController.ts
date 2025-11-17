import { Request, Response, NextFunction } from 'express';


export interface IConversationController {
  createPrivateConversation: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getResendConversations: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}