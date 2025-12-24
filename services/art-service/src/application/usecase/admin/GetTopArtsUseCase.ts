import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAdminArtRepository } from "../../../domain/repositories/IAdminArtRepository";
import { IGetTopArtsUseCase } from "../../interface/usecase/admin/IGetTopArtsUseCase";
import { ArtPost } from "../../../domain/entities/ArtPost";

@injectable()
export class GetTopArtsUseCase implements IGetTopArtsUseCase {
  constructor(
    @inject(TYPES.IAdminArtRepository) private _repository: IAdminArtRepository
  ) {}

  async execute(limit: number, type: 'likes' | 'price'): Promise<ArtPost[]> {
    return this._repository.getTopArts(limit, type);
  }
}
