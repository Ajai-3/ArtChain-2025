import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAdminArtRepository } from "../../../domain/repositories/IAdminArtRepository";
import { IGetArtStatsUseCase } from "../../interface/usecase/admin/IGetArtStatsUseCase";

@injectable()
export class GetArtStatsUseCase implements IGetArtStatsUseCase {
  constructor(
    @inject(TYPES.IAdminArtRepository) private _repository: IAdminArtRepository
  ) {}

  async execute() {
    return this._repository.countStats();
  }
}
