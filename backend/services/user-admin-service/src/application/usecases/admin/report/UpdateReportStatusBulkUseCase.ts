import { injectable, inject } from 'inversify';
import { BadRequestError } from 'art-chain-shared';
import { ILogger } from '../../../interface/ILogger';
import { IArtService } from '../../../interface/http/IArtService';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { ADMIN_MESSAGES } from '../../../../constants/adminMessages';
import { IReportRepository } from '../../../../domain/repositories/user/IReportRepository';
import { IUpdateReportStatusBulkUseCase } from '../../../interface/usecases/admin/report/IUpdateReportStatusBulkUseCase';

@injectable()
export class UpdateReportStatusBulkUseCase implements IUpdateReportStatusBulkUseCase {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IReportRepository)
    private readonly _reportRepository: IReportRepository,
    @inject(TYPES.IArtService) private readonly _artService: IArtService,
  ) {}

  async execute(
    targetId: string,
    targetType: string,
    status: 'resolved' | 'dismissed',
    token?: string,
  ): Promise<{ updated: number }> {
    if (!targetId || !targetType || !status) {
      throw new BadRequestError(ADMIN_MESSAGES.INVALID_REQUEST);
    }

    if (!['resolved', 'dismissed'].includes(status)) {
      throw new BadRequestError(ADMIN_MESSAGES.INVALID_REQUEST);
    }

    const result = await this._reportRepository.updateBulkByTarget(
      targetId,
      targetType,
      status,
    );

    if (status === 'resolved' && targetType === 'ART' && token) {
      this._logger.info(
        `[BulkUpdate] Resolving reports for ART ${targetId}, marking as deleted`,
      );
      try {
        await this._artService.updateArtStatus(token, targetId, 'deleted');
        this._logger.info(
          `[BulkUpdate] Successfully marked ART ${targetId} as deleted in art-service`,
        );
      } catch (error) {
        this._logger.error(
          `[BulkUpdate] Failed to update art status for ${targetId}:`,
          error,
        );
      }
    }

    if (status === 'resolved' && targetType === 'COMMENT' && token) {
      this._logger.info(
        `[BulkUpdate] Resolving reports for COMMENT ${targetId}, deleting permanently`,
      );
      try {
        await this._artService.deleteComment(token, targetId);
        this._logger.info(
          `[BulkUpdate] Successfully deleted COMMENT ${targetId} in art-service`,
        );
      } catch (error) {
        this._logger.error(
          `[BulkUpdate] Failed to delete comment ${targetId}:`,
          error,
        );
      }
    }

    this._logger.info(`[BulkUpdate] Successfully updated ${result} report(s)`);
    return { updated: result };
  }
}
