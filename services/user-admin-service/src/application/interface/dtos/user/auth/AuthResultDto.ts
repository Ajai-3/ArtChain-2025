import { SafeUser } from "../../../../../domain/repositories/IBaseRepository";

export interface AuthResultDto {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean;
}