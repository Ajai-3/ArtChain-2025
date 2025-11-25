import { injectable, inject } from "inversify";
import { TYPES } from "../../../../infrastructure/Inversify/types";
import { IAIConfigRepository } from "../../../../domain/repositories/IAIConfigRepository";
import { IGetAIConfigsUseCase } from "../../../interface/usecase/ai/admin/IGetAIConfigsUseCase";

@injectable()
export class GetAIConfigsUseCase implements IGetAIConfigsUseCase {
  constructor(
    @inject(TYPES.IAIConfigRepository) private readonly _aiConfigRepo: IAIConfigRepository
  ) {}

  async execute() {
    const configs = await this._aiConfigRepo.findAll();
    return configs || [];
  }
}
