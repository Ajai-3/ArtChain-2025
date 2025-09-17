export interface GetAllUsersQueryDTO {
  search?: string;
  page?: number;
  limit?: number;
  userIds?: string[];
  role?: string;
  status?: string;
  plan?: string;
}
