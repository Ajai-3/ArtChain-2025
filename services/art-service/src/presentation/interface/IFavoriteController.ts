import { Request, Response, NextFunction } from "express";

export interface IFavoriteController {
  addFavorite(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  removeFavorite(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getFavoriteCount(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getFavoritedUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
