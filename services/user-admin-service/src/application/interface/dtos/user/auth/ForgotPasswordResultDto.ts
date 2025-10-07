import { SafeUser } from '../../../../../domain/repositories/IBaseRepository';

export interface ForgotPasswordResultDto {
  user: SafeUser;
  token: string;
}
