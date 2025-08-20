import { Request, Response, NextFunction } from "express";

export interface IArtistRequestController {
  createArtistRequest(req: Request, res: Response, next: NextFunction): Promise<any>;
}