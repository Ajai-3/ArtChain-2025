import { Request, Response, NextFunction } from "express";

export interface IAIController {
  generateImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getMyGenerations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkQuota: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getEnabledConfigs(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteGeneration(req: Request, res: Response, next: NextFunction): Promise<void>;
}
