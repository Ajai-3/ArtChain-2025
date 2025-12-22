import { Request, Response, NextFunction } from "express";

export interface ICommissionController {
  requestCommission: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getCommissionByConversation: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  updateCommission: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
