import { Request, Response, NextFunction } from "express";

export interface IAuctionController {
  createAuction(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAuctions(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAuction(req: Request, res: Response, next: NextFunction): Promise<void>;
}
