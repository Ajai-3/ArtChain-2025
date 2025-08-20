import { ArtistRequestRepositoryImpl } from "./../../../../infrastructure/repositories/user/ArtistRequestRepositoryImpl";
import { ArtistRequest } from "@prisma/client";
import { CreateArtistRequestDto } from "../../../../domain/dtos/user/CreateArtistRequestDto";
import { IArtistRequestRepository } from "../../../../domain/repositories/user/IArtistRequestRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class CreateArtistRequestUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _artistRequestRepo: IArtistRequestRepository
  ) {}

  async execute(data: CreateArtistRequestDto): Promise<ArtistRequest> {
    const { userId, bio, phone, country } = data;

    const newRequest = await this._artistRequestRepo.createArtistRequest({
      userId,
      status: "pending",
      rejectionReason: "",
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
