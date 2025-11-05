import { inject, injectable } from "inversify";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
import { UserPreview } from "../../../../types/UserPreview";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { IGetUserSupportersUseCase } from "../../../interface/usecases/user/user-intraction/IGetUserSupportersUseCase";

@injectable()
export class GetUserSupportersUseCase implements IGetUserSupportersUseCase {
  constructor(
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(userId: string, page = 1, limit = 10): Promise<UserPreview[]> {
    const supporters = await this._supporterRepo.getSupporters(
      userId,
      page,
      limit
    );

    return supporters.map((user) => ({
      ...user,
      profileImage: mapCdnUrl(user.profileImage) ?? null,
    }));
  }
}
