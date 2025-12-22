import { SafeUser } from '../../../../../domain/entities/User';

export interface ForgotPasswordResultDto {
  user: SafeUser;
  token: string;
}
