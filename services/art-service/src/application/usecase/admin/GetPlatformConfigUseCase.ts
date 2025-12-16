import { injectable, inject } from "inversify";
import { IGetPlatformConfigUseCase } from "../../interface/usecase/admin/IGetPlatformConfigUseCase";
import { IPlatformConfigRepository } from "../../../domain/repositories/IPlatformConfigRepository";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { PlatformConfig } from "../../../domain/entities/PlatformConfig";

import { GetPlatformConfigDTO } from "../../interface/dto/admin/GetPlatformConfigDTO";

@injectable()
export class GetPlatformConfigUseCase implements IGetPlatformConfigUseCase {
  constructor(
    @inject(TYPES.IPlatformConfigRepository)
    private readonly _repository: IPlatformConfigRepository
  ) {}

  async execute(dto?: GetPlatformConfigDTO): Promise<PlatformConfig> {
    return this._repository.getConfig();
  }
}
