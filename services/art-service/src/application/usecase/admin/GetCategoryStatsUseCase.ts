import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IGetCategoryStatsUseCase } from "../../interface/usecase/admin/IGetCategoryStatsUseCase";

@injectable()
export class GetCategoryStatsUseCase implements IGetCategoryStatsUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository) private _repository: IArtPostRepository
  ) {}

  async execute(): Promise<{ category: string; count: number }[]> {
    return this._repository.getCategoryStats();
  }
}
