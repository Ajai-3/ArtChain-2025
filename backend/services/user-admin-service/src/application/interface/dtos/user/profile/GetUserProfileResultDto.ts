import { SafeUser } from '../../../../../domain/entities/User';

export interface GetUserProfileResultDto {
  user: SafeUser;
  isCurrentUser: boolean;
  isSupporting?: boolean;
  artWorkCount: number;
  supportingCount: number;
  supportersCount: number;
}