import { MessageResponseDto } from "./MessageResponseDto";

export interface ListMessagesResponse {
  messages: MessageResponseDto[];
  pagination: {
    currentPage: number;
    hasMore: boolean;
    totalCount: number;
    nextPage?: number;
  };
}
