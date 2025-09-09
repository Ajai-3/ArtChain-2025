import { ArtPost } from "../../domain/entities/ArtPost";
import { CreateArtPostDTO } from "../../domain/dto/CreateArtPostDTO";
import { IArtPostRepository } from "../../domain/repositories/IArtPostRepository";
import { ICreateArtPostUseCase } from "../../domain/usecase/ICreateArtPostUseCase";
import { ArtPostResponseDTO } from "../../domain/dto/ArtPostResponseDTO";

export class CreateArtPostUseCase implements ICreateArtPostUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

 async execute(dto: CreateArtPostDTO): Promise<any> {

    const art = new ArtPost(
      dto.userId,
      dto.title,
      dto.description,
      dto.artType,
      dto.hashtags,
      dto.originalUrl,
      dto.watermarkedUrl,
      dto.aspectRatio,
      dto.commentingDisabled,
      dto.downloadingDisabled,
      dto.isPrivate,
      dto.isSensitive,
      dto.supporterOnly,
      dto.isForSale,
      dto.priceType,
      dto.artcoins,
      dto.fiatPrice
    );

    const created = await this._artRepo.create(art);
    return created
  }
}
