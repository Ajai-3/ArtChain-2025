import { SafeUser } from "../../../../../domain/repositories/IBaseRepository";

export interface GetCurrentUserResultDto {
  user: SafeUser;
  supportingCount: number;
  supportersCount: number;
}
