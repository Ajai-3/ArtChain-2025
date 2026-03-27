import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/Inversify/types';
import { IAIConfigRepository } from '../../../../domain/repositories/IAIConfigRepository';
import { IUpdateAIConfigUseCase } from '../../../interface/usecase/ai/admin/IUpdateAIConfigUseCase';

@injectable()
export class UpdateAIConfigUseCase implements IUpdateAIConfigUseCase {
  constructor(
    @inject(TYPES.IAIConfigRepository)
    private readonly _aiConfigRepo: IAIConfigRepository,
  ) {}

  async execute(provider: string, updates: any) {
    try {
      // Find existing config
      const existingConfig = await this._aiConfigRepo.findByProvider(provider);

      if (existingConfig) {
        // Use the id field directly from the entity
        const updated = await this._aiConfigRepo.update(
          existingConfig.id,
          updates,
        );
        return updated;
      }

      // Create new config
      const newConfig = await this._aiConfigRepo.create({
        provider,
        displayName: updates.displayName || provider,
        enabled: updates.enabled !== undefined ? updates.enabled : false,
        isFree: updates.isFree !== undefined ? updates.isFree : true,
        dailyFreeLimit: updates.dailyFreeLimit || 5,
        artcoinCostPerImage: updates.artcoinCostPerImage || 0,
        defaultModel: updates.defaultModel || '',
        availableModels: updates.availableModels || [],
        maxPromptLength: updates.maxPromptLength || 500,
        allowedResolutions: updates.allowedResolutions || [
          '512x512',
          '768x768',
          '1024x1024',
        ],
        maxImageCount: updates.maxImageCount || 4,
        defaultSteps: updates.defaultSteps || 30,
        defaultGuidanceScale: updates.defaultGuidanceScale || 7.5,
        priority: updates.priority || 99,
        apiKey: updates.apiKey || '',
        ...updates,
      });
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
