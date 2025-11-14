import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { BadRequestError, ERROR_MESSAGES } from "art-chain-shared";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICountArtWorkUseCase } from "../../interface/usecase/art/ICountArtWorkUseCase";

@injectable()
export class CountArtWorkUseCase implements ICountArtWorkUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository
  ) {}
  async execute(userId: string): Promise<number> {
    if (!userId) {
      throw new BadRequestError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return await this._artRepo.countByUser(userId);
  }
}
