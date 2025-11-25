import { GenerateAIImageDTO } from "../../dto/ai/GenerateAIImageDTO";

export interface IGenerateAIImageUseCase {
  execute(input: GenerateAIImageDTO): Promise<any>;
}
