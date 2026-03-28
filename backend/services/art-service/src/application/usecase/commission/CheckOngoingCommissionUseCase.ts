import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommissionRepository } from '../../../domain/repositories/ICommissionRepository';
import { ICheckOngoingCommissionUseCase } from '../../interface/usecase/commission/ICheckOngoingCommissionUseCase';
import { CommissionStatus } from '../../../domain/entities/Commission';

@injectable()
export class CheckOngoingCommissionUseCase implements ICheckOngoingCommissionUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository
  ) {}

  async execute(requesterId: string, artistId: string): Promise<{ hasOngoing: boolean }> {
    const commissions = await this._commissionRepository.findByRequesterIdAndArtistId(requesterId, artistId);
    
    // Statuses that are considered "ongoing"
    const ongoingStatuses: CommissionStatus[] = [
      CommissionStatus.REQUESTED,
      CommissionStatus.NEGOTIATING,
      CommissionStatus.AGREED,
      CommissionStatus.LOCKED,
      CommissionStatus.IN_PROGRESS,
      CommissionStatus.DISPUTE_RAISED
    ];

    const hasOngoing = commissions.some(c => ongoingStatuses.includes(c.status));

    return { hasOngoing };
  }
}
