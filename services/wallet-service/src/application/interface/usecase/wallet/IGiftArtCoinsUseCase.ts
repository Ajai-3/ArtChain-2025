export interface IGiftArtCoinsUseCase {
  execute(data: {
    senderId: string;
    receiverId: string;
    amount: number;
    message?: string;
    senderName?: string;
    senderImage?: string;
  }): Promise<{ success: boolean; newBalance: number; lockedAmount: number; message: string }>;
}