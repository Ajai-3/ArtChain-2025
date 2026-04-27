import type { UserPublicProfile } from '../../../types/user';

export interface IUserService {
  getUserById(
    userId: string,
    currentUserId?: string,
  ): Promise<UserPublicProfile | null>;
  getUsersByIds(
    userIds: string[],
    currentUserId?: string,
  ): Promise<UserPublicProfile[]>;
  getUserByUsername(
    username: string,
  ): Promise<UserPublicProfile | null>;
}
