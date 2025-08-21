import { Request, Response, NextFunction } from "express";

export interface IArtistRequestController {
  createArtistRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  hasUserSubmittedRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}