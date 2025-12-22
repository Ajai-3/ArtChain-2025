import { Request, Response, NextFunction } from "express";

export interface IAdminWithdrawalController {
  getAllWithdrawalRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateWithdrawalStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
