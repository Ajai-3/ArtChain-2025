import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { validateWithZod } from '../../../utils/zodValidator';
import { USER_MESSAGES } from '../../../constants/userMessages';
import { TYPES } from '../../../infrastructure/inversify/types';
import { ILogger } from '../../../application/interface/ILogger';
import { IReportController } from '../../interfaces/user/IReportController';
import { ReportRequestSchema } from '../../../application/validations/user/ReportRequestSchema';
import { ReportRequestDto } from '../../../application/interface/dtos/user/report/ReportRequestDto';
import { ICreateReportUseCase } from '../../../application/interface/usecases/user/report/ICreateReportUseCase';

@injectable()
export class ReportController implements IReportController {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.ICreateReportUseCase)
    private readonly _createReportUseCase: ICreateReportUseCase,
  ) {}

  //# ================================================================================================================
  //# CREATE A REPORT
  //# ================================================================================================================
  //# POST /api/v1/user/report
  //# Request body: { targetType, reason, description, targetId }
  //# This controller creates a new report for content moderation.
  //# ================================================================================================================
  createReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const reporterId = req.headers['x-user-id'] as string;

      const dto: ReportRequestDto = {
        ...validateWithZod(ReportRequestSchema, {
          ...req.body,
          reporterId,
        }),
      };

      const token = req.headers['authorization']?.split(' ')[1];
      const report = await this._createReportUseCase.execute(dto, token);

      this._logger.info('Report created sucessfully');

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: USER_MESSAGES.REPORTED_SUCCESSFULLY,
        data: report,
      });
    } catch (error: any) {
      next(error);
    }
  };
}
