import { Request, Response, NextFunction } from "express";

export interface ITransactionController {
  getTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  processPurchase(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}
