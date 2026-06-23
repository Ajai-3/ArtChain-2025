import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IAIGenerationRepository } from '../../../domain/repositories/IAIGenerationRepository';
import { IDeleteAIGenerationUseCase } from '../../interface/usecase/ai/IDeleteAIGenerationUseCase';
import { NotFoundError, ForbiddenError, BadRequestError } from 'art-chain-shared';
import { AI_MESSAGES } from '../../../constants/AIMessages';

@injectable()
export class DeleteAIGenerationUseCase implements IDeleteAIGenerationUseCase {
  constructor(
    @inject(TYPES.IAIGenerationRepository) private readonly _aiGenerationRepo: IAIGenerationRepository
  ) {}

  async execute(generationId: string, userId: string): Promise<void> {
    if (!userId || !generationId) {
      throw new BadRequestError(AI_MESSAGES.ID_AND_USERID_REQUIRED);
    }
    const generation = await this._aiGenerationRepo.findById(generationId);
    
    if (!generation) {
      throw new NotFoundError(AI_MESSAGES.GENERATION_NOT_FOUND);
    }

    if (generation.userId !== userId) {
      throw new ForbiddenError(AI_MESSAGES.NOT_AUTHORIZED_TO_DELETE);
    }

    await this._aiGenerationRepo.delete(generationId);
  }
}
