import { Request, Response, NextFunction } from 'express';

export interface IAdminWalletController {
  getAllWallets: (req: Request, res: Response, next: NextFunction) =>  Promise<void>;
  searchWallets: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateWalletStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getUserTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getRevenueStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
