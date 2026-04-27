import type { GetCommissionByConversationResponse } from '../../../../types/usecase-response';

export interface IGetCommissionByConversationUseCase {
  execute(conversationId: string): Promise<GetCommissionByConversationResponse>;
}
