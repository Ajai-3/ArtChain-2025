import { Request, Response } from 'express';

export interface IAdminWalletController {
  getAllWallets: (req: Request, res: Response) =>  Promise<void>;
  searchWallets: (req: Request, res: Response) => Promise<void>;
  updateWalletStatus: (req: Request, res: Response) => Promise<void>;
  getUserTransactions: (req: Request, res: Response) => Promise<void>;
  getRevenueStats: (req: Request, res: Response) => Promise<void>;
}
