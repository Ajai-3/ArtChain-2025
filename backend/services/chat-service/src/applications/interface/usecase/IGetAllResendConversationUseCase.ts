import { EnrichedConversation } from '../../mappers/mapConversations';

export interface GetAllResendConversationResponse {
  conversations: EnrichedConversation[];
  page: number;
  limit: number;
  nextPage: number | null;
  hasNextPage: boolean;
  total: number;
}

export interface IGetAllResendConversationUseCase {
  execute(userId: string, limit: number, page: number): Promise<GetAllResendConversationResponse>;
}