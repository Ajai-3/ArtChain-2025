export interface IChatService {
  createRequestConversation(userId: string, artistId: string): Promise<string>; // Returns conversationId
}
