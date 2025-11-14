import { inject, injectable } from "inversify";
import { ArtPost } from "../../../domain/entities/ArtPost";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IGetArtByIdUseCase } from "../../interface/usecase/art/IGetArtByIdUseCase";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";

@injectable()
export class GetArtByIdUseCase implements IGetArtByIdUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository
  ) {}

  async execute(id: string): Promise<ArtPost | null> {
    return await this._artRepo.getById(id);
  }
}
