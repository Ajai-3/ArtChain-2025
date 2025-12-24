import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IGetTopArtsUseCase } from "../../interface/usecase/admin/IGetTopArtsUseCase";
import { ArtPost } from "../../../domain/entities/ArtPost";

@injectable()
export class GetTopArtsUseCase implements IGetTopArtsUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository) private _repository: IArtPostRepository
  ) {}

  async execute(limit: number, type: 'likes' | 'price'): Promise<ArtPost[]> {
    return this._repository.getTopArts(limit, type);
  }
}
