import { Request, Response, NextFunction } from "express";

export interface ITransactionController {
  getTransactions: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  createTransaction:(
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;

  processSplitPurchase: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  processPayment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  lockCommissionFunds: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  distributeCommissionFunds: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  refundCommissionFunds: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}
