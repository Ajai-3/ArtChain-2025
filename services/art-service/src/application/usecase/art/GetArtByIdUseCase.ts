import { ArtPost } from "../../../domain/entities/ArtPost";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IGetArtByIdUseCase } from "../../interface/usecase/art/IGetArtByIdUseCase";


export class GetArtByIdUseCase implements IGetArtByIdUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

  async execute(id: string): Promise<ArtPost | null> {
    return await this._artRepo.getById(id);
  }
}
