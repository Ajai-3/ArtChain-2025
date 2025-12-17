import { SafeUser } from "../../../../../domain/entities/User";

export interface InitializeAuthResultDto {
  accessToken: string;
  user: SafeUser;
}
