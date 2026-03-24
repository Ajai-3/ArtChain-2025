import { injectable, inject } from 'inversify';
import { Report, ReportReason, ReportTargetType } from '../../../../domain/entities/Report';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { ReportRequestDto } from '../../../interface/dtos/user/report/ReportRequestDto';
import { IReportRepository } from '../../../../domain/repositories/user/IReportRepository';
import { IArtService } from '../../../interface/http/IArtService';
import { ICreateReportUseCase } from '../../../interface/usecases/user/report/ICreateReportUseCase';


@injectable()
export class CreateReportUseCase implements ICreateReportUseCase {
  constructor(
    @inject(TYPES.IReportRepository) private reportRepository: IReportRepository,
    @inject(TYPES.IArtService) private artService: IArtService
  ) {}

  async execute(dto: ReportRequestDto, token?: string): Promise<Report> {
    const targetType = dto.targetType.toUpperCase();

    // 1. Prevent reporting own content/profile
    if (targetType === 'USER') {
      if (dto.reporterId === dto.targetId) {
        throw new Error('You cannot report yourself.');
      }
    } else if (targetType === 'ART' && token) {
      const artData = await this.artService.getArt(token, dto.targetId);
      if (artData && artData.art && artData.art.userId === dto.reporterId) {
        throw new Error('You cannot report your own artwork.');
      }
    } else if (targetType === 'COMMENT' && token) {
      const commentData = await this.artService.getComment(token, dto.targetId);
      if (commentData && commentData.userId === dto.reporterId) {
        throw new Error('You cannot report your own comment.');
      }
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
