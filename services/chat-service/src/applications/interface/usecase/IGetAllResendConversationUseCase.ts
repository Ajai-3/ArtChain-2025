export interface IGetAllResendConversationUseCase {
  execute(userId: string, limit: number, page: number): Promise<any>;
}