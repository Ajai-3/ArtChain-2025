import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommissionRepository } from '../../../domain/repositories/ICommissionRepository';
import { CommissionStatus } from '../../../domain/entities/Commission';

@injectable()
export class CheckActiveCommissionUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private _commissionRepo: ICommissionRepository,
  ) {}

  async execute(requesterId: string, artistId: string): Promise<boolean> {
    const commissions = await this._commissionRepo.findByRequesterIdAndArtistId(
      requesterId,
      artistId,
    );

    const inactiveStatuses: string[] = [
      CommissionStatus.COMPLETED,
      CommissionStatus.CANCELLED,
      CommissionStatus.CLOSED,
    ];

    const hasActive = commissions.some(
      (c) => c.artistId === artistId && !inactiveStatuses.includes(c.status),
    );

    return hasActive;
  }
}
