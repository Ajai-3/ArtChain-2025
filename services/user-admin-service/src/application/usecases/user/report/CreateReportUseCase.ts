import { injectable, inject } from 'inversify';
import { Report, ReportReason, ReportTargetType } from '../../../../domain/entities/Report';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { ReportRequestDto } from '../../../interface/dtos/user/report/ReportRequestDto';
import { IReportRepository } from '../../../../domain/repositories/user/IReportRepository';
import { ICreateReportUseCase } from '../../../interface/usecases/user/report/ICreateReportUseCase';


@injectable()
export class CreateReportUseCase implements ICreateReportUseCase {
  constructor(
    @inject(TYPES.IReportRepository) private reportRepository: IReportRepository
  ) {}

  async execute(dto: ReportRequestDto): Promise<Report> {
    // 1. Prevent self-reporting (if target is USER)
    if (dto.targetType.toUpperCase() === 'USER' && dto.reporterId === dto.targetId) {
      throw new Error('You cannot report yourself.');
    }

    // 2. Prevent duplicate reports
    const existingReport = await this.reportRepository.findByReporterAndTarget(
      dto.reporterId,
      dto.targetId,
      dto.targetType
    );

    if (existingReport) {
      throw new Error('You have already reported this content.');
    }

    const reportData: Partial<Report> = {
      reporterId: dto.reporterId,
      targetId: dto.targetId,
      targetType: dto.targetType.toUpperCase() as ReportTargetType,
      reason: dto.reason as ReportReason,
      description: dto.description ?? null,
      status: 'pending',
    };

    return this.reportRepository.create(reportData);
  }
}
