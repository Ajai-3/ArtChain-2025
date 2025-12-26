import { Request, Response, NextFunction } from 'express';

export interface IAdminWalletController {
  getAllWallets: (req: Request, res: Response, next: NextFunction) =>  Promise<Response | void>;

  updateWalletStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getUserTransactions: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getRevenueStats: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getTransactionStats: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getAllRecentTransactions: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getAdminTransactions: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
