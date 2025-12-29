import { Request, Response, NextFunction } from "express";

export interface IAuctionController {
  createAuction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getAuctions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getAuctionsWithStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getAuction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getAuctionStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;

  getRecentAuctions(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  cancelAuction(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
