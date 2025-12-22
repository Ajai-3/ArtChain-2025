import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAIGenerationRepository } from "../../../domain/repositories/IAIGenerationRepository";
import { IDeleteAIGenerationUseCase } from "../../interface/usecase/ai/IDeleteAIGenerationUseCase";
import { NotFoundError, ForbiddenError } from "art-chain-shared";

@injectable()
export class DeleteAIGenerationUseCase implements IDeleteAIGenerationUseCase {
  constructor(
    @inject(TYPES.IAIGenerationRepository) private readonly _aiGenerationRepo: IAIGenerationRepository
  ) {}

  async execute(generationId: string, userId: string): Promise<void> {
    const generation = await this._aiGenerationRepo.findById(generationId);
    
    if (!generation) {
      throw new NotFoundError("AI Generation not found");
    }

    if (generation.userId !== userId) {
      throw new ForbiddenError("You are not authorized to delete this generation");
    }

    await this._aiGenerationRepo.delete(generationId);
  }
}
