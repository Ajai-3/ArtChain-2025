import { Request, Response, NextFunction } from "express";

export interface IWalletController {
  getWallet(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  createWallet(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateWallet(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
