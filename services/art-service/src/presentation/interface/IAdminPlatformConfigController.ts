import { Request, Response, NextFunction } from "express";

export interface IAdminPlatformConfigController {
  getConfig(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateConfig(req: Request, res: Response, next: NextFunction): Promise<void>;
}
