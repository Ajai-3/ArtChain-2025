import { SafeUser } from "../../../repositories/IBaseRepository";

export interface GetCurrentUserResultDto {
  user: SafeUser;
  supportingCount: number;
  supportersCount: number;
}
