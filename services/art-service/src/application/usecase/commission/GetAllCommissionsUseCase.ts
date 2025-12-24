import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { CommissionMapper } from "../../mapper/CommissionMapper";
import { UserService } from "../../../infrastructure/service/UserService";

@injectable()
export class GetAllCommissionsUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository
  ) {}

  async execute(page: number, limit: number, status?: string): Promise<any> {
    const filter: any = {};
    if (status) filter.status = status;

    const { commissions, total } = await this._commissionRepository.findAllFiltered(filter, page, limit);

    // Collect all user IDs
    const userIds = new Set<string>();
    commissions.forEach(c => {
      if (c.requesterId) userIds.add(c.requesterId);
      if (c.artistId) userIds.add(c.artistId);
    });

    // Fetch user details
    const users = await this._userService.getUsersByIds(Array.from(userIds));
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    // Enrich DTOs
    const dtos = CommissionMapper.toCollectionDTO(commissions).map((dto: any) => ({
      ...dto,
      requester: userMap.get(dto.requesterId),
      artist: userMap.get(dto.artistId)
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
