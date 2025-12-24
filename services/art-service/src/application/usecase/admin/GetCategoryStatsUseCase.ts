import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAdminArtRepository } from "../../../domain/repositories/IAdminArtRepository";
import { IGetCategoryStatsUseCase } from "../../interface/usecase/admin/IGetCategoryStatsUseCase";

@injectable()
export class GetCategoryStatsUseCase implements IGetCategoryStatsUseCase {
  constructor(
    @inject(TYPES.IAdminArtRepository) private _repository: IAdminArtRepository
  ) {}

  async execute(): Promise<{ category: string; count: number }[]> {
    return this._repository.getCategoryStats();
  }
}
