import { SafeUser } from "../../../repositories/IBaseRepository";

export interface AuthResultDto {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean;
}