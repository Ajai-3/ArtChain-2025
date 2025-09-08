import { Request, Response, NextFunction } from 'express';

export interface IUploadController {
  uploadProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  uploadBanner(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  uploadArt(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
