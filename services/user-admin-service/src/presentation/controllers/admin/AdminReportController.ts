import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminReportController } from '../../interfaces/admin/IAdminReportController';
import { IGetAllReportsUseCase } from '../../../application/interface/usecases/admin/report/IGetAllReportsUseCase';
import { IGetGroupedReportsUseCase } from '../../../application/interface/usecases/admin/report/IGetGroupedReportsUseCase';
import { IUpdateReportStatusBulkUseCase } from '../../../application/interface/usecases/admin/report/IUpdateReportStatusBulkUseCase';

@injectable()
export class AdminReportController implements IAdminReportController {
  constructor(
    @inject(TYPES.IGetAllReportsUseCase)
    private readonly _getAllReportsUseCase: IGetAllReportsUseCase,
    @inject(TYPES.IGetGroupedReportsUseCase)
    private readonly _getGroupedReportsUseCase: IGetGroupedReportsUseCase,
    @inject(TYPES.IUpdateReportStatusBulkUseCase)
    private readonly _updateReportStatusBulkUseCase: IUpdateReportStatusBulkUseCase
  ) {}

  getAllReports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { status, targetType } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      
      const filters = {
        status: status as string,
        targetType: targetType as string,
      };

      const result = await this._getAllReportsUseCase.execute(page, limit, filters);

      return res.status(HttpStatus.OK).json({
        message: 'Reports fetched successfully',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  getGroupedReports = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { status, targetType } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      
      const filters = {
        status: status as string,
        targetType: targetType as string,
      };

      const result = await this._getGroupedReportsUseCase.execute(page, limit, filters);

      return res.status(HttpStatus.OK).json({
        message: 'Grouped reports fetched successfully',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  updateReportStatusBulk = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { targetId, targetType, status } = req.body;
      console.log('[AdminReportController] Bulk update request:', { targetId, targetType, status });

      if (!targetId || !targetType || !status) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'targetId, targetType, and status are required',
        });
      }

      if (!['resolved', 'dismissed'].includes(status)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'status must be either "resolved" or "dismissed"',
        });
      }

      const result = await this._updateReportStatusBulkUseCase.execute(
        targetId,
        targetType,
        status
      );

      console.log('[AdminReportController] Bulk update result:', result);

      return res.status(HttpStatus.OK).json({
        message: `Successfully updated ${result.updated} report(s)`,
        data: result,
      });
    } catch (error) {
      console.error('[AdminReportController] Bulk update error:', error);
      next(error);
    }
  };
}
