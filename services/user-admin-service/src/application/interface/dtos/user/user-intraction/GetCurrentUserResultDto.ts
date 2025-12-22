import { SafeUser } from '../../../../../domain/entities/User';

export interface GetCurrentUserResultDto {
  user: SafeUser;
  supportingCount: number;
  supportersCount: number;
}
