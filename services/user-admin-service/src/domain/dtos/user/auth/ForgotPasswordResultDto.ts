import { SafeUser } from "../../../repositories/IBaseRepository";

export interface ForgotPasswordResultDto {
  user: SafeUser;
  token: string;
}
