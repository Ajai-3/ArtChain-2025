import { Commission } from "../../../../domain/entities/Commission";

export interface IGetCommissionByConversationUseCase {
  execute(conversationId: string): Promise<any>;
}
