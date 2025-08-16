import { NotFoundError } from "art-chain-shared";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";

export class GetCurrentUserUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(userId: string): Promise<any> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const supportersCount = await this._userRepo.getSupportersCount(userId);
    const supportingCount = await this._userRepo.getSupportingCount(userId);

    return { user, supportingCount, supportersCount };
  }
}
