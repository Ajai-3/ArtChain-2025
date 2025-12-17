import { SafeUser } from '../../../../../domain/entities/User';

export interface AuthResultDto {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean;
}