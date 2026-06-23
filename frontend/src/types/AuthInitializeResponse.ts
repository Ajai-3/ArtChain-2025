import type { User } from './users/user/user';

export interface AuthInitializeResponse {
  accessToken: string;
  user: User;
}
