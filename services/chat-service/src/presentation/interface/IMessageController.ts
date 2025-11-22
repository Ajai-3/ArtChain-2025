import { Request, Response, NextFunction } from "express";

export interface IMessageController {
  sendMessage: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  listMessages: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  deleteMessage: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}