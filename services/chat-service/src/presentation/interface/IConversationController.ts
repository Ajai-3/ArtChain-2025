import { Request, Response, NextFunction } from 'express';

export interface IConversationController {
  createPrivateConversation: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  createGroupConversation: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getResendConversations: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getGroupMembers: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  removeGroupMember: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  addGroupAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  removeGroupAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  addGroupMember: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}