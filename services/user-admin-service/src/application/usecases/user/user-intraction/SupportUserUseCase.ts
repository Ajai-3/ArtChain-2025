import { BadRequestError, NotFoundError } from "art-chain-shared";
import { USER_MESSAGES } from "../../../../constants/userMessages";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { ISupportUserUseCase } from "../../../../domain/usecases/user/user-intraction/ISupportUserUseCase";
import { SupportUnSupportRequestDto } from "../../../../domain/dtos/user/user-intraction/SupportUnSupportRequestDto";

export class SupportUserUseCase implements ISupportUserUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(data: SupportUnSupportRequestDto): Promise<void> {
    const { userId, currentUserId } = data;

    if (!userId || !currentUserId) {
      throw new BadRequestError(USER_MESSAGES.INVALID_SUPPORT_REQUEST);
    }

    const supporter = await this._userRepo.findById(currentUserId);
    if (!supporter) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    const targetUser = await this._userRepo.findById(userId);
    if (!targetUser) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const isSupporting = await this._supporterRepo.isSupporting(
      supporter.id,
      targetUser.id
    );
    if (isSupporting) {
      throw new BadRequestError(USER_MESSAGES.ALREADY_SUPPORTING);
    }

    await this._supporterRepo.addSupport(supporter.id, targetUser.id);
  }
}
