import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAIGenerationRepository } from "../../../domain/repositories/IAIGenerationRepository";
import { IGetMyAIGenerationsUseCase } from "../../interface/usecase/ai/IGetMyAIGenerationsUseCase";

@injectable()
export class GetMyAIGenerationsUseCase implements IGetMyAIGenerationsUseCase {
  constructor(
    @inject(TYPES.IAIGenerationRepository) private readonly _aiGenerationRepo: IAIGenerationRepository
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 20) {
    const generations = await this._aiGenerationRepo.findByUserId(userId, page, limit);
    
    return {
      generations,
      page,
      limit,
      total: generations.length
    };
  }
}
