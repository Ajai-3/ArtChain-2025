import type { AIConfig } from '../../../../../domain/entities/AIConfig';

export interface IUpdateAIConfigUseCase {
  execute(provider: string, updates: Record<string, unknown>): Promise<AIConfig>;
}
