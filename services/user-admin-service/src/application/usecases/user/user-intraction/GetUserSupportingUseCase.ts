import { inject, injectable } from "inversify";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
import { UserPreview } from "../../../../types/UserPreview";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { IGetUserSupportingUseCase } from "../../../interface/usecases/user/user-intraction/IGetUserSupportingUseCase";

@injectable()
export class GetUserSupportingUseCase implements IGetUserSupportingUseCase {
  constructor(
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(userId: string, page = 1, limit = 10): Promise<UserPreview[]> {
    const supportings = await this._supporterRepo.getSupporting(
      userId,
      page,
      limit
    );

    return supportings.map((user) => ({
      ...user,
      profileImage: mapCdnUrl(user.profileImage) ?? null,
    }));
  }
}
