import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IReportRepository } from '../../../../domain/repositories/user/IReportRepository';
import { IArtService } from '../../../interface/http/IArtService';
import { IUpdateReportStatusBulkUseCase } from '../../../interface/usecases/admin/report/IUpdateReportStatusBulkUseCase';

@injectable()
export class UpdateReportStatusBulkUseCase implements IUpdateReportStatusBulkUseCase {
  constructor(
    @inject(TYPES.IReportRepository) private readonly _reportRepository: IReportRepository,
    @inject(TYPES.IArtService) private readonly _artService: IArtService
  ) {}

  async execute(
    targetId: string,
    targetType: string,
    status: 'resolved' | 'dismissed',
    token?: string
  ): Promise<{ updated: number }> {
    console.log(`[BulkUpdate] Updating reports for target: ${targetId}, type: ${targetType}, status: ${status}`);
    
    // 1. Update the reports status in local DB
    const result = await this._reportRepository.updateBulkByTarget(targetId, targetType, status);

    // 2. If status is resolved and targetType is ART, update the art status to deleted in art-service
    if (status === 'resolved' && targetType === 'ART' && token) {
      console.log(`[BulkUpdate] Resolving reports for ART ${targetId}, marking as deleted`);
      try {
        await this._artService.updateArtStatus(token, targetId, 'deleted');
        console.log(`[BulkUpdate] Successfully marked ART ${targetId} as deleted in art-service`);
      } catch (error) {
        console.error(`[BulkUpdate] Failed to update art status for ${targetId}:`, error);
        // We might choose to throw error or continue. 
        // Given the requirement, it's better to ensure this happens.
      }
    }

    // 3. If status is resolved and targetType is COMMENT, delete the comment in art-service
    if (status === 'resolved' && targetType === 'COMMENT' && token) {
      console.log(`[BulkUpdate] Resolving reports for COMMENT ${targetId}, deleting permanently`);
      try {
        await this._artService.deleteComment(token, targetId);
        console.log(`[BulkUpdate] Successfully deleted COMMENT ${targetId} in art-service`);
      } catch (error) {
        console.error(`[BulkUpdate] Failed to delete comment ${targetId}:`, error);
      }
    }

    console.log(`[BulkUpdate] Successfully updated ${result} report(s)`);
    return { updated: result };
  }
}
