import { AIConfig } from "../../../../domain/entities/AIConfig";

export interface IGetEnabledAIConfigsUseCase {
  execute(): Promise<AIConfig[]>;
}
