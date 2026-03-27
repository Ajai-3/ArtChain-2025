import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminReportController } from '../../interfaces/admin/IAdminReportController';
import { IGetAllReportsUseCase } from '../../../application/interface/usecases/admin/report/IGetAllReportsUseCase';
import { IGetGroupedReportsUseCase } from '../../../application/interface/usecases/admin/report/IGetGroupedReportsUseCase';
import { IUpdateReportStatusBulkUseCase } from '../../../application/interface/usecases/admin/report/IUpdateReportStatusBulkUseCase';
import { ADMIN_MESSAGES } from '../../../constants/adminMessages';
import { ILogger } from '../../../application/interface/ILogger';

@injectable()
export class AdminReportController implements IAdminReportController {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IGetAllReportsUseCase)
    private readonly _getAllReportsUseCase: IGetAllReportsUseCase,
    @inject(TYPES.IGetGroupedReportsUseCase)
    private readonly _getGroupedReportsUseCase: IGetGroupedReportsUseCase,
    @inject(TYPES.IUpdateReportStatusBulkUseCase)
    private readonly _updateReportStatusBulkUseCase: IUpdateReportStatusBulkUseCase,
  ) {}

  ///# ================================================================================================================
  //# GET ALL REPORTS
  //# ================================================================================================================
  //# PATCH /api/v1/admin/report
  //# Query params: none
  //# This controller allows the admin to fetch all the reports with optional filters
  //# ================================================================================================================
  getAllReports = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { status, targetType } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const filters = {
        status: status as string,
        targetType: targetType as string,
      };

      const result = await this._getAllReportsUseCase.execute(
        page,
        limit,
        filters,
      );

      this._logger.info(
        '[AdminReportController] All reports fetched successfully',
      );

      return res.status(HttpStatus.OK).json({
        message: ADMIN_MESSAGES.REPORTS_FETCHED_SUCCESS,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  ///# ================================================================================================================
  //# GET GROUPED REPORTS
  //# ================================================================================================================
  //# PATCH /api/v1/admin/report/grouped
  //# Query params: none
  //# This controller allows the admin to fetch the grouped reports with optional filters
  //# ================================================================================================================
  getGroupedReports = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { status, targetType } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const filters = {
        status: status as string,
        targetType: targetType as string,
      };

      const result = await this._getGroupedReportsUseCase.execute(
        page,
        limit,
        filters,
      );

      this._logger.info(
        '[AdminReportController] Grouped reports fetched successfully',
      );

      return res.status(HttpStatus.OK).json({
        message: ADMIN_MESSAGES.REPORTS_FETCHED_SUCCESS,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  ///# ================================================================================================================
  //# UPDATE REPORT STATUS BULK
  //# ================================================================================================================
  //# PATCH /api/v1/admin/report/bulk
  //# Query params: none
  //# This controller allows the admin to update the status of multiple reports at once
  //# ================================================================================================================
  updateReportStatusBulk = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { targetId, targetType, status } = req.body;

      const token = req.headers.authorization?.split(' ')[1];
      const result = await this._updateReportStatusBulkUseCase.execute(
        targetId,
        targetType,
        status,
        token,
      );

      this._logger.info('[AdminReportController] Bulk update result', result);

      return res.status(HttpStatus.OK).json({
        message: ADMIN_MESSAGES.REPORTS_UPDATED_SUCCESSFULLY,
        data: result,
      });
    } catch (error) {
      this._logger.error('[AdminReportController] Bulk update error', error);
      next(error);
    }
  };
}
