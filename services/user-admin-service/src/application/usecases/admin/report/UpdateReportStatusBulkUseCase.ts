import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IReportRepository } from '../../../../domain/repositories/user/IReportRepository';
import { IUpdateReportStatusBulkUseCase } from '../../../interface/usecases/admin/report/IUpdateReportStatusBulkUseCase';

@injectable()
export class UpdateReportStatusBulkUseCase implements IUpdateReportStatusBulkUseCase {
  constructor(
    @inject(TYPES.IReportRepository) private readonly _reportRepository: IReportRepository
  ) {}

  async execute(
    targetId: string,
    targetType: string,
    status: 'resolved' | 'dismissed'
  ): Promise<{ updated: number }> {
    console.log(`[BulkUpdate] Updating reports for target: ${targetId}, type: ${targetType}, status: ${status}`);
    
    const result = await this._reportRepository.updateBulkByTarget(targetId, targetType, status);

    console.log(`[BulkUpdate] Successfully updated ${result} report(s)`);
    return { updated: result };
  }
}
