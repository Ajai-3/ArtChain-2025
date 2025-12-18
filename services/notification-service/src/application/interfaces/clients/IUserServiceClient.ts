export interface UserDetails {
  id: string;
  name: string;
  username: string;
  profileImage: string;
}

export interface IUserServiceClient {
  getUser(userId: string): Promise<UserDetails | null>;
  getUsers(userIds: string[]): Promise<UserDetails[]>;
}
