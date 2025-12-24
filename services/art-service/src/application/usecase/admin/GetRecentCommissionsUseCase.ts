import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { IGetRecentCommissionsUseCase } from "../../interface/usecase/admin/IGetRecentCommissionsUseCase";
import { Commission } from "../../../domain/entities/Commission";

@injectable()
export class GetRecentCommissionsUseCase implements IGetRecentCommissionsUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository) private _repository: ICommissionRepository
  ) {}

  async execute(limit: number): Promise<Commission[]> {
    return this._repository.findRecent(limit);
  }
}
