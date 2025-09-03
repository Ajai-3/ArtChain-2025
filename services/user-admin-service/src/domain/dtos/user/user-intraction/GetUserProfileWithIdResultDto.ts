import { SafeUser } from '../../../repositories/IBaseRepository';

export interface GetUserProfileWithIdResultDto {
  user: SafeUser;
  isSupporting: boolean;
  supportingCount: number;
  supportersCount: number;
}