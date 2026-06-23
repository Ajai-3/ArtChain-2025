import type { GetAIConfigsResponse } from '../../../../../types/usecase-response';

export interface IGetAIConfigsUseCase {
  execute(): Promise<GetAIConfigsResponse>;
}
