export interface DeleteMessageDto {
  userId: string;
  messageId: string;
  mode: "ME" | "EVERYONE";
}