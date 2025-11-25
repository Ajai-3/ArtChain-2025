import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAIGenerationRepository } from "../../../domain/repositories/IAIGenerationRepository";
import { IAIConfigRepository } from "../../../domain/repositories/IAIConfigRepository";
import { ICheckAIQuotaUseCase } from "../../interface/usecase/ai/ICheckAIQuotaUseCase";

@injectable()
export class CheckAIQuotaUseCase implements ICheckAIQuotaUseCase {
  constructor(
    @inject(TYPES.IAIGenerationRepository) private readonly _aiGenerationRepo: IAIGenerationRepository,
    @inject(TYPES.IAIConfigRepository) private readonly _aiConfigRepo: IAIConfigRepository
  ) {}

  async execute(userId: string) {
    // Get enabled AI configs to determine daily limit
    const configs = await this._aiConfigRepo.findAllEnabled();
    if (!configs || configs.length === 0) {
      throw new Error("No AI providers are currently enabled");
    }

    const sortedConfigs = configs.sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
    const dailyLimit = sortedConfigs[0]?.dailyFreeLimit || 5;

    // Count today's free generations
    const used = await this._aiGenerationRepo.countTodayFreeGenerations(userId);
    const remaining = Math.max(0, dailyLimit - used);

    // Calculate reset time (midnight)
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
