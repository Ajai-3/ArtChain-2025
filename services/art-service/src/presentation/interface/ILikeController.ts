import { Request, Response, NextFunction } from "express";

export interface ILikeController {
  likePost(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  unlikePost(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getLikeCount(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getLikedUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
