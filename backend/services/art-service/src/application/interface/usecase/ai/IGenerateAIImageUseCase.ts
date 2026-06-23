import { GenerateAIImageDTO } from '../../dto/ai/GenerateAIImageDTO';
import type { GenerateAIImageResponse } from '../../../../types/usecase-response';

export interface IGenerateAIImageUseCase {
  execute(input: GenerateAIImageDTO): Promise<GenerateAIImageResponse>;
}
