export interface IUserService {
  getUserById(userId: string, currentUserId?: string): Promise<any>;
  getUsersByIds(userIds: string[], currentUserId?: string): Promise<any[]>;
  getUserByUsername(username: string): Promise<any>;
}
