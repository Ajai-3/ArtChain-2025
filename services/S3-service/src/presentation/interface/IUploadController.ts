import { Request, Response, NextFunction } from "express";

export interface IUploadController {
  uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  uploadArt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  deleteImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  getSignedUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
}
