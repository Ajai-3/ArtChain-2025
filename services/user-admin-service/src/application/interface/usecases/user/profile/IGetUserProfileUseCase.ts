import { GetUserProfileRequestDto } from '../../../dtos/user/profile/GetUserProfileRequestDto';
import { GetUserProfileResultDto } from '../../../dtos/user/profile/GetUserProfileResultDto';

export interface IGetUserProfileUseCase {
  execute(data: GetUserProfileRequestDto): Promise<GetUserProfileResultDto>;
}