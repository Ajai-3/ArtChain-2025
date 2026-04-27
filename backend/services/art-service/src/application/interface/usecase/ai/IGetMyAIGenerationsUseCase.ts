import type { GetMyAIGenerationsResponse } from '../../../../types/usecase-response';

export interface IGetMyAIGenerationsUseCase {
  execute(userId: string, page: number, limit: number): Promise<GetMyAIGenerationsResponse>;
}
