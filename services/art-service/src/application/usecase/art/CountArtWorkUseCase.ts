import { BadRequestError, ERROR_MESSAGES } from "art-chain-shared";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";

export class CountArtWorkUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}
  async execute(userId: string): Promise<number> {
    if (!userId) {
      throw new BadRequestError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return await this._artRepo.countByUser(userId);
  }
}
