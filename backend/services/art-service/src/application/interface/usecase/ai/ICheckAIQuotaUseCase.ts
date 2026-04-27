import type { CheckAIQuotaResponse } from '../../../../types/usecase-response';

export interface ICheckAIQuotaUseCase {
  execute(userId: string): Promise<CheckAIQuotaResponse>;
}
