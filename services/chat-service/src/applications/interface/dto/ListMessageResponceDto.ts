import { MessageResponseDto } from "./MessageResponseDto";

export interface ListMessagesResponse {
  messages: MessageResponseDto[];
  pagination: {
    hasMore: boolean;
    totalCount: number;
    nextPage?: number;
    nextFromId?: string;
  };
}
