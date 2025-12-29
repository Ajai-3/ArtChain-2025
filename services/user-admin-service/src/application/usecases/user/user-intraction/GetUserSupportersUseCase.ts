import { inject, injectable } from "inversify";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
import { UserPreview } from "../../../../types/UserPreview";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { IGetUserSupportersUseCase } from "../../../interface/usecases/user/user-intraction/IGetUserSupportersUseCase";
import { GetSupportersRequestDto } from "../../../interface/dtos/user/user-intraction/GetSupportersRequestDto";

@injectable()
export class GetUserSupportersUseCase implements IGetUserSupportersUseCase {
  constructor(
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(dto: GetSupportersRequestDto): Promise<UserPreview[]> {
    const { currentUserId, userId, page, limit } = dto;

    const supporters = await this._supporterRepo.getSupporters(
      userId,
      page,
      limit
    );

    const currentUserSupportIds = await this._supporterRepo.getSupportingIds(
      currentUserId
    );

    const currentUserSupportSet = new Set(currentUserSupportIds);

    const result = supporters.map((user) => ({
      ...user,
      profileImage: mapCdnUrl(user.profileImage) ?? null,
      isSupporting: currentUserSupportSet.has(user.id),
    }));

    if (userId === currentUserId) {
        return result.filter(s => s.id !== currentUserId);
    }

    return result;
  }
}
