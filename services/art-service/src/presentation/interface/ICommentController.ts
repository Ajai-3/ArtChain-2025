import { Request, Response, NextFunction } from "express";

export interface ICommentController {
  createComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  editComment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getComments: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  delete: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}
