import { Request, Response, NextFunction } from "express";

export interface IArtElasticController {
  indexArt(req: Request, res: Response, next: NextFunction): Promise<void>;
  searchArts(req: Request, res: Response, next: NextFunction): Promise<void>;
  adminSearchArts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
