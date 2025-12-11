import { Request, Response, NextFunction } from "express";

export interface IBidController {
  placeBid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getBids(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getUserBids(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}
