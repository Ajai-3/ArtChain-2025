import { GetUserProfileRequestDto } from '../../../dtos/user/profile/GetUserProfileRequestDto';
import { UserProfile } from '../../../../../types';

export interface IGetUserWithIdUserUseCase {
  execute(data: GetUserProfileRequestDto): Promise<UserProfile>;
}