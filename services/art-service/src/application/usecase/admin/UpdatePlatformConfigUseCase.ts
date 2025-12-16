import { injectable, inject } from "inversify";
import { IUpdatePlatformConfigUseCase } from "../../interface/usecase/admin/IUpdatePlatformConfigUseCase";
import { IPlatformConfigRepository } from "../../../domain/repositories/IPlatformConfigRepository";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { PlatformConfig } from "../../../domain/entities/PlatformConfig";

import { UpdatePlatformConfigDTO } from "../../interface/dto/admin/UpdatePlatformConfigDTO";

@injectable()
export class UpdatePlatformConfigUseCase implements IUpdatePlatformConfigUseCase {
  constructor(
    @inject(TYPES.IPlatformConfigRepository)
    private readonly _repository: IPlatformConfigRepository
  ) {}

  async execute(dto: UpdatePlatformConfigDTO): Promise<PlatformConfig> {
    return this._repository.updateConfig(dto);
  }
}
