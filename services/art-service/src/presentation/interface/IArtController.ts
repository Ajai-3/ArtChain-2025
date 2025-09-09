import { Request, Response, NextFunction } from "express";

export interface IArtController {
  getAllArt(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getArtById(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  createArt(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateArt(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  deleteArt(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
