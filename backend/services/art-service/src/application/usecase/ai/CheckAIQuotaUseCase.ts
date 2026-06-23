import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IAIGenerationRepository } from '../../../domain/repositories/IAIGenerationRepository';
import { IAIConfigRepository } from '../../../domain/repositories/IAIConfigRepository';
import { ICheckAIQuotaUseCase } from '../../interface/usecase/ai/ICheckAIQuotaUseCase';
import type { CheckAIQuotaResponse } from '../../../types/usecase-response';
import type { AIConfig } from '../../../domain/entities/AIConfig';
import { NotFoundError } from 'art-chain-shared';
import { AI_MESSAGES } from '../../../constants/AIMessages';

@injectable()
export class CheckAIQuotaUseCase implements ICheckAIQuotaUseCase {
  constructor(
    @inject(TYPES.IAIGenerationRepository) private readonly _aiGenerationRepo: IAIGenerationRepository,
    @inject(TYPES.IAIConfigRepository) private readonly _aiConfigRepo: IAIConfigRepository
  ) {}

  async execute(userId: string): Promise<CheckAIQuotaResponse> {
    const configs = await this._aiConfigRepo.findAllEnabled();
    if (!configs || configs.length === 0) {
      throw new NotFoundError(AI_MESSAGES.NO_PROVIDERS_ENABLED);
    }

    const sortedConfigs = configs.sort((a: AIConfig, b: AIConfig) => (a.priority || 0) - (b.priority || 0));
    const dailyLimit = sortedConfigs[0]?.dailyFreeLimit || 5;

    const used = await this._aiGenerationRepo.countTodayFreeGenerations(userId);
    const remaining = Math.max(0, dailyLimit - used);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return {
      used,
      limit: dailyLimit,
      remaining,
      resetAt: tomorrow.toISOString()
    };
  }
}
