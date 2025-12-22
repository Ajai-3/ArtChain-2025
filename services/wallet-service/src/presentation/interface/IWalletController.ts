import { Request, Response, NextFunction } from "express";

export interface IWalletController {
  getWallet: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  createWallet: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  updateWallet: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  lockAmount: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  unlockAmount: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  settleAuction: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getChartData: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  giftArtCoins: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
