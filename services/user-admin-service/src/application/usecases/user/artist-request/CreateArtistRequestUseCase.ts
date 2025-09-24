import { ArtistRequest } from '@prisma/client';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { CreateArtistRequestDto } from '../../../../domain/dtos/user/artist-request/CreateArtistRequestDto';
import { IArtistRequestRepository } from '../../../../domain/repositories/user/IArtistRequestRepository';
import { ICreateArtistRequestUseCase } from '../../../../domain/usecases/user/artist-request/ICreateArtistRequestUseCase';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { ARTIST_MESSAGES } from '../../../../constants/artistMessages';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';
import { ArtService } from '../../../../infrastructure/http/ArtService';

export class CreateArtistRequestUseCase implements ICreateArtistRequestUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _artistRequestRepo: IArtistRequestRepository,
    private readonly _supporterRepo: ISupporterRepository,
    private readonly _artService: ArtService
  ) {}

  async execute(data: CreateArtistRequestDto): Promise<ArtistRequest> {
    const { userId, bio, phone, country } = data;

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    if (user.isVerified) {
      throw new BadRequestError(ARTIST_MESSAGES.ALREADY_ARTIST);
    }

    const existingRequests = await this._artistRequestRepo.getByUser(userId);
    const hasPending = existingRequests.some(req => req.status === 'pending');
    if (hasPending) {
      throw new BadRequestError(ARTIST_MESSAGES.REQUEST_ALREADY_EXISTS);
    }

    const accountAgeInDays =
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (accountAgeInDays < 10) {
      throw new BadRequestError(
        "User account must be at least 10 days old to create an artist request."
      );
    }

    // Original 1 month check commented out
    // const accountAgeInMonths =
    //   (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
    // if (accountAgeInMonths < 1) {
    //   throw new BadRequestError(
    //     "User account must be at least 1 month old to create an artist request."
    //   );
    // }

    const { supportersCount, supportingCount } =
      await this._supporterRepo.getUserSupportersAndSupportingCounts(userId);

    if (supportersCount < 20) {
      throw new BadRequestError(
        "User must have at least 20 supporters to create an artist request."
      );
    }
    if (supportingCount < 20) {
      throw new BadRequestError(
        "User must be supporting at least 20 others to create an artist request."
      );
    }

    const artworkCount = await this._artService.getUserArtCount(userId);
    if (artworkCount < 10) {
      throw new BadRequestError(
        "User must have at least 10 artworks to create an artist request."
      );
    }

    const newRequest = await this._artistRequestRepo.createArtistRequest({
      userId,
      status: 'pending',
      rejectionReason: '',
    });

    // Update optional user details if provided
    const updateData: Partial<{ bio: string; phone: string; country: string }> =
      {};
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;

    if (Object.keys(updateData).length > 0) {
      await this._userRepo.update(userId, updateData);
    }

    return newRequest;
  }
}
