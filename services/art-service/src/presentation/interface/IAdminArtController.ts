import { Request, Response, NextFunction } from "express";

export interface IAdminArtController {
  getAllArts(req: Request, res: Response, next: NextFunction): Promise<void>;
  getArtStats(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateArtStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
