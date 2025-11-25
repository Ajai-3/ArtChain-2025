import { Request, Response, NextFunction } from "express";

export interface IAdminAIController {
  updateConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getConfigs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  testProvider: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getAnalytics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
