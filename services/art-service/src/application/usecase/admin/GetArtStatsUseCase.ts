import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IGetArtStatsUseCase } from "../../interface/usecase/admin/IGetArtStatsUseCase";

@injectable()
export class GetArtStatsUseCase implements IGetArtStatsUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository) private _repository: IArtPostRepository
  ) {}

  async execute(): Promise<{
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  }> {
    return this._repository.countStats();
  }
}
