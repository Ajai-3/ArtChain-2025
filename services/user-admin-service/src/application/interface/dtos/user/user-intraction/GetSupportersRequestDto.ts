export interface GetSupportersRequestDto {
  currentUserId: string;
  userId: string;
  page: number;
  limit: number;
}
