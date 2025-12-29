import { Request, Response, NextFunction } from "express";

export interface IAdminArtController {
  getAllArts: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getArtStats: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getTopArts: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getCategoryStats: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  updateArtStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
