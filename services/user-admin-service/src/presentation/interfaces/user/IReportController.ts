import { Request, Response, NextFunction } from 'express';

export interface IReportController {
  createReport(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
