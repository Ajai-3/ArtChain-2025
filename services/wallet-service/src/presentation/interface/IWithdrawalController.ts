import { Request, Response, NextFunction } from "express";

export interface IWithdrawalController {
  createWithdrawalRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getWithdrawalRequests(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
