import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommissionRepository } from '../../../domain/repositories/ICommissionRepository';
import { CommissionMapper } from '../../mapper/CommissionMapper';
import { IUserService } from '../../interface/service/IUserService';
import { Commission } from '../../../domain/entities/Commission';
import type { MongoQuery } from '../../../types/mongo';

interface UserInfo {
  id?: string;
  name?: string;
  username?: string;
  profileImage?: string;
}

@injectable()
export class GetAllCommissionsUseCase {
  constructor(
     @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository
  ) {}

  async execute(page: number, limit: number, status?: string) {
    const filter: MongoQuery = {};
    if (status) filter.status = status;

    const { commissions, total } = await this._commissionRepository.findAllFiltered(filter, page, limit);

    const userIds = new Set<string>();
    commissions.forEach((c: Commission) => {
      if (c.requesterId) userIds.add(c.requesterId);
      if (c.artistId) userIds.add(c.artistId);
    });

    const users = await this._userService.getUsersByIds(Array.from(userIds));
    const userMap = new Map<string, UserInfo>(users.map((u) => [u.id || '', u]));

    const dtos = CommissionMapper.toCollectionDTO(commissions).map((dto) => ({
      ...dto,
      requester: userMap.get(dto.requesterId || ''),
      artist: userMap.get(dto.artistId || '')
    }));

    return {
      commissions: dtos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
