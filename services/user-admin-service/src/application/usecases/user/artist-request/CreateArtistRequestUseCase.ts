import { ArtistRequest } from '@prisma/client';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { CreateArtistRequestDto } from '../../../../domain/dtos/user/artist-request/CreateArtistRequestDto';
import { IArtistRequestRepository } from '../../../../domain/repositories/user/IArtistRequestRepository';
import { ICreateArtistRequestUseCase } from '../../../../domain/usecases/user/artist-request/ICreateArtistRequestUseCase';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { ARTIST_MESSAGES } from '../../../../constants/artistMessages';

export class CreateArtistRequestUseCase implements ICreateArtistRequestUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _artistRequestRepo: IArtistRequestRepository
  ) {}

  async execute(data: CreateArtistRequestDto): Promise<ArtistRequest> {
    const { userId, bio, phone, country } = data;

    const user = await this._userRepo.findById(userId)

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND)
    }

    if (user.isVerified) {
      throw new BadRequestError(ARTIST_MESSAGES.ALREADY_ARTIST)
    }

    const newRequest = await this._artistRequestRepo.createArtistRequest({
      userId,
      status: 'pending',
      rejectionReason: '',
    });

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
