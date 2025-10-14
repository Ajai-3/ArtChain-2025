import { Role } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { ARTIST_MESSAGES } from "../../../../constants/artistMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { IArtistRequestRepository } from "../../../../domain/repositories/user/IArtistRequestRepository";
import { ArtistAproveRejectRequestDto } from "../../../interface/dtos/admin/user-management/ArtistAproveRejectRequestDto";
import { IApproveArtistRequestUseCase } from "../../../interface/usecases/admin/user-management/IApproveArtistRequestUseCase";
import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
} from "art-chain-shared";
import { IArtService } from "../../../interface/http/IArtService";

@injectable()
export class ApproveArtistRequestUseCase
  implements IApproveArtistRequestUseCase
{
  constructor(
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository,
    @inject(TYPES.IArtistRequestRepository)
    private readonly _artistRepo: IArtistRequestRepository,
    @inject(TYPES.IArtService) private readonly _artService: IArtService
  ) {}

  async execute(dto: ArtistAproveRejectRequestDto): Promise<any> {
    const { id } = dto;

    const artistRequest = await this._artistRepo.findById(id);

    if (!artistRequest) {
      throw new BadRequestError(ARTIST_MESSAGES.ARTISRT_REQUEST_NOT_FOUND);
    }

    const userId = artistRequest.userId;

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const accountAgeInDays =
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);

    if (accountAgeInDays < 10) {
      throw new BadRequestError(
        "User account must be at least 10 days old to become an artist."
      );
    }

    // const accountAgeInMonths =
    //   (Date.now() - new Date(user.createdAt).getTime()) /
    //   (1000 * 60 * 60 * 24 * 30);

    // if (accountAgeInMonths < 1) {
    //   throw new BadRequestError(
    //     "User account must be at least 1 month old to become an artist."
    //   );
    // }

    const { supportersCount, supportingCount } =
      await this._supporterRepo.getUserSupportersAndSupportingCounts(userId);

    if (supportersCount < 20) {
      throw new BadRequestError("User must have at least 20 supporters.");
    }
    if (supportingCount < 20) {
      throw new BadRequestError("User must be supporting at least 20 others.");
    }

    const artworkCount = await this._artService.getUserArtCount(userId);
    if (artworkCount < 10) {
      throw new BadRequestError(
        "User must have at least 10 artworks to become an artist."
      );
    }

    const updatedUser = await this._userRepo.update(userId, {
      isVerified: true,
      role: Role.artist,
    });

    const approvedRequest = await this._artistRepo.approve(id);

    return {
      user: updatedUser,
      request: approvedRequest,
    };
  }
}
