import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAIConfigRepository } from "../../../domain/repositories/IAIConfigRepository";
import { IGetEnabledAIConfigsUseCase } from "../../interface/usecase/ai/IGetEnabledAIConfigsUseCase";

@injectable()
export class GetEnabledAIConfigsUseCase implements IGetEnabledAIConfigsUseCase {
  constructor(
    @inject(TYPES.IAIConfigRepository) private readonly _aiConfigRepo: IAIConfigRepository
  ) {}

  async execute(): Promise<any[]> {
    const configs = await this._aiConfigRepo.findAllEnabled();
    
    // Sanitize configs (remove api keys)
    return configs.map(config => ({
      ...config,
      apiKey: undefined
    }));
  }
}
