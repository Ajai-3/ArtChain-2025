import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
} from "art-chain-shared";

import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

import { UpdateUserProfileDTO } from "../../../interface/dtos/user/profile/UpdateUserProfileDTO";
import { USER_MESSAGES } from "../../../../constants/userMessages";

export class UpdateProfileUserUseCase {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(dto:  UpdateUserProfileDTO): Promise<any> {
    let { userId, username, ...updateData } = dto;

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }


    if (username && username !== user.username) {
      const existingUser = await this._userRepo.findByUsername(username);
      if (existingUser) {
        throw new BadRequestError(ERROR_MESSAGES.DUPLICATE_USERNAME);
      }
      updateData.username = username
    }

    const updatedUser = await this._userRepo.update(userId, updateData);

    if (!updatedUser) {
      throw new BadRequestError(USER_MESSAGES.PROFILE_UPDATE_FAILED);
    }

    return updatedUser;
  }
}
