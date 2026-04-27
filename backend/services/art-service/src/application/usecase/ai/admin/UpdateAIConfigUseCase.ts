import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/Inversify/types';
import { IAIConfigRepository } from '../../../../domain/repositories/IAIConfigRepository';
import { IUpdateAIConfigUseCase } from '../../../interface/usecase/ai/admin/IUpdateAIConfigUseCase';
import type { JsonObject } from '../../../../types/json';
import type { AIConfig } from '../../../../domain/entities/AIConfig';

@injectable()
export class UpdateAIConfigUseCase implements IUpdateAIConfigUseCase {
  constructor(
    @inject(TYPES.IAIConfigRepository)
    private readonly _aiConfigRepo: IAIConfigRepository,
  ) {}

  async execute(provider: string, updates: JsonObject): Promise<AIConfig> {
    try {
      const existingConfig = await this._aiConfigRepo.findByProvider(provider);

      if (existingConfig) {
        const updated = await this._aiConfigRepo.update(
          existingConfig.id,
          updates as Partial<AIConfig>,
        );
        return updated;
      }

      const newConfig = await this._aiConfigRepo.create({
        id: '',
        provider,
        displayName: (updates.displayName as string) || provider,
        enabled: updates.enabled !== undefined ? (updates.enabled as boolean) : false,
        isFree: updates.isFree !== undefined ? (updates.isFree as boolean) : true,
        dailyFreeLimit: (updates.dailyFreeLimit as number) || 5,
        artcoinCostPerImage: (updates.artcoinCostPerImage as number) || 0,
        defaultModel: (updates.defaultModel as string) || '',
        availableModels: (updates.availableModels as string[]) || [],
        maxPromptLength: (updates.maxPromptLength as number) || 500,
        allowedResolutions: (updates.allowedResolutions as string[]) || ['512x512', '768x768', '1024x1024'],
        maxImageCount: (updates.maxImageCount as number) || 4,
        defaultSteps: (updates.defaultSteps as number) || 30,
        defaultGuidanceScale: (updates.defaultGuidanceScale as number) || 7.5,
        priority: (updates.priority as number) || 99,
        apiKey: (updates.apiKey as string) || '',
      } as AIConfig);
      return newConfig;
    } catch (error) {
      console.error('===== UpdateAIConfigUseCase ERROR =====');
      console.error('Error:', error);
      console.error(
        'Error stack:',
        error instanceof Error ? error.stack : 'No stack trace',
      );
      throw error;
    }
  }
}