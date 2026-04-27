import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IAIConfigRepository } from '../../../domain/repositories/IAIConfigRepository';
import { IGetEnabledAIConfigsUseCase } from '../../interface/usecase/ai/IGetEnabledAIConfigsUseCase';
import { AIConfig } from '../../../domain/entities/AIConfig';

@injectable()
export class GetEnabledAIConfigsUseCase implements IGetEnabledAIConfigsUseCase {
  constructor(
    @inject(TYPES.IAIConfigRepository) private readonly _aiConfigRepo: IAIConfigRepository
  ) {}

  async execute(): Promise<Omit<AIConfig, 'apiKey'>[]> {
    const configs = await this._aiConfigRepo.findAllEnabled();
    
    return configs.map(config => ({
      id: config.id,
      provider: config.provider,
      displayName: config.displayName,
      enabled: config.enabled,
      isFree: config.isFree,
      dailyFreeLimit: config.dailyFreeLimit,
      artcoinCostPerImage: config.artcoinCostPerImage,
      defaultModel: config.defaultModel,
      availableModels: config.availableModels,
      maxPromptLength: config.maxPromptLength,
      allowedResolutions: config.allowedResolutions,
      maxImageCount: config.maxImageCount,
      defaultSteps: config.defaultSteps,
      defaultGuidanceScale: config.defaultGuidanceScale,
      priority: config.priority,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt
    }));
  }
}
