import { UpdateArtPostDTO } from "../../../domain/dto/UpdateArtPostDTO";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IUpdateArtPostUseCase } from "../../../domain/usecase/art/IUpdateArtPostUseCase";



export class UpdateArtPostUseCase implements IUpdateArtPostUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

  async execute(id: string, dto: UpdateArtPostDTO): Promise<any> {
  //   const updated = await this._artRepo.update(id, dto);
  //   if (!updated) throw new Error("Art not found");

  //   const { id: artId, title, description, artType, hashtags, originalUrl, watermarkedUrl, aspectRatio, isForSale, priceType, artcoins, fiatPrice, postType, updatedAt } = updated;
  //   return { id: artId, title, description, artType, hashtags, originalUrl, watermarkedUrl, aspectRatio, isForSale, priceType, artcoins, fiatPrice, postType, updatedAt };
  }
}
