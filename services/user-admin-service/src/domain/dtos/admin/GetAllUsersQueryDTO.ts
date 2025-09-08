export interface GetAllUsersQueryDTO {
  search?: string;
  page?: number;
  limit?: number;
  userIds?: string[];
}