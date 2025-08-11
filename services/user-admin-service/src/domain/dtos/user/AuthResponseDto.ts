import { SafeUser } from '../../repositories/IBaseRepository';

export interface AuthResponseDto {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}