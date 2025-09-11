import { ERROR_MESSAGES, HttpStatus, NotFoundError } from "art-chain-shared";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IGetArtByNameUseCase } from "../../../domain/usecase/art/IGetArtByNameUseCase";
import { UserService } from "../../../infrastructure/service/UserService";
import { ART_MESSAGES } from "../../../constants/ArtMessages";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";

export class GetArtByNameUseCase implements IGetArtByNameUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

  async execute(artName: string, currentUserId: string) {
    const artFull = await this._artRepo.findByArtName(artName);
    if (!artFull) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    console.log(currentUserId);

    const userRes = await UserService.getUserById(
      artFull.userId,
      currentUserId
    );
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return toArtWithUserResponse(artFull, userRes.data);
  }
}
