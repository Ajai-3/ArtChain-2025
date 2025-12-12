import { Request, Response, NextFunction } from 'express';

export interface IAdminReportController {
  getAllReports(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getGroupedReports(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateReportStatusBulk(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
