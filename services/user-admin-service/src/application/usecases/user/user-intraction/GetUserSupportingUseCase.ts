import { SafeUser } from "../../../../domain/repositories/IBaseRepository";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { UserPreview } from "../../../../types/UserPreview";

export class GetUserSupportingUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(userId: string, page = 1, limit = 10): Promise<UserPreview[]> {
    return this._supporterRepo.getSupporting(userId, page, limit);
  }
}
