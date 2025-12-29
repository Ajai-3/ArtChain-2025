import { inject, injectable } from "inversify";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
import { UserPreview } from "../../../../types/UserPreview";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { IGetUserSupportingUseCase } from "../../../interface/usecases/user/user-intraction/IGetUserSupportingUseCase";
import { GetSupportingRequestDto } from "../../../interface/dtos/user/user-intraction/GetSupportingRequestDto";
import { logger } from "../../../../utils/logger";
import { ILogoutUserUseCase } from "../../../interface/usecases/user/auth/ILogoutUserUseCase";
import { ILogger } from "../../../interface/ILogger";

@injectable()
export class GetUserSupportingUseCase implements IGetUserSupportingUseCase {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(dto: GetSupportingRequestDto): Promise<UserPreview[]> {
    const { currentUserId, userId, page, limit } = dto;
    const supportings = await this._supporterRepo.getSupporting(
      userId,
      page,
      limit
    );

    const currentUserSupportIds = await this._supporterRepo.getSupportingIds(
      currentUserId
    );

    const currentUserSupportSet = new Set(currentUserSupportIds);

    const result = supportings.map((user) => ({
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
