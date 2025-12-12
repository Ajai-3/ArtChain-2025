import { injectable, inject } from "inversify";
import { IGetAIAnalyticsUseCase } from "../../../interface/usecase/ai/admin/IGetAIAnalyticsUseCase";
import { TYPES } from "../../../../infrastructure/Inversify/types";
import { IAIGenerationRepository } from "../../../../domain/repositories/IAIGenerationRepository";
import { IAIConfigRepository } from "../../../../domain/repositories/IAIConfigRepository";

@injectable()
export class GetAIAnalyticsUseCase implements IGetAIAnalyticsUseCase {
  constructor(
    @inject(TYPES.IAIGenerationRepository) private readonly _aiGenerationRepository: IAIGenerationRepository,
    @inject(TYPES.IAIConfigRepository) private readonly _aiConfigRepository: IAIConfigRepository
  ) {}

  async execute(): Promise<{ totalGenerations: number; activeModels: number }> {
    const totalGenerations = await this._aiGenerationRepository.count();
    const activeConfigs = await this._aiConfigRepository.findAllEnabled();
    
    return {
      totalGenerations,
      activeModels: activeConfigs.length
    };
  }
}
