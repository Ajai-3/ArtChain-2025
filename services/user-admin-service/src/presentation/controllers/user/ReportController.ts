import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IReportController } from '../../interfaces/user/IReportController';
import { ICreateReportUseCase } from '../../../application/interface/usecases/user/report/ICreateReportUseCase';
import { validateWithZod } from '../../../utils/zodValidator';
import { ReportRequestSchema } from '../../../application/validations/user/ReportRequestSchema';
import { ReportRequestDto } from '../../../application/interface/dtos/user/report/ReportRequestDto';

@injectable()
export class ReportController implements IReportController {
  constructor(
    @inject(TYPES.ICreateReportUseCase)
    private readonly _createReportUseCase: ICreateReportUseCase
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
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const reporterId = req.headers['x-user-id'] as string;
      const validatedData = validateWithZod(ReportRequestSchema, {...req.body, reporterId});

      const dto: ReportRequestDto = {
        reporterId: validatedData.reporterId,
        targetId: validatedData.targetId,
        targetType: validatedData.targetType,
        reason: validatedData.reason,
        description: validatedData.description,
      };

      const report = await this._createReportUseCase.execute(dto);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Report created successfully',
        data: report,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Failed to create report',
      });
    }
  };
}
