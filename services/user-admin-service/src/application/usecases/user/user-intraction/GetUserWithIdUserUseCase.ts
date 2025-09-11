import { BadRequestError, NotFoundError } from "art-chain-shared";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { USER_MESSAGES } from "./../../../../constants/userMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { IGetUserWithIdUserUseCase } from "../../../../domain/usecases/user/user-intraction/IGetUserWithIdUserUseCase";
import { GetUserProfileRequestDto } from "../../../../domain/dtos/user/profile/GetUserProfileRequestDto";

export class GetUserWithIdUserUseCase implements IGetUserWithIdUserUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(data: GetUserProfileRequestDto): Promise<any> {
    const { userId } = data;

    if (!userId) {
      throw new BadRequestError(USER_MESSAGES.USER_ID_REQUIRED);
    }

    const user = await this._userRepo.findById(userId);

    return user;
  }
}
