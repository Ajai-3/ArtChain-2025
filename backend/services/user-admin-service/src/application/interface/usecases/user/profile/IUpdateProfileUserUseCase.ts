import { UpdateUserProfileDto } from '../../../dtos/user/profile/UpdateUserProfileDTO';
import { SafeUser } from '../../../../../domain/entities/User';

export interface IUpdateProfileUserUseCase {
  execute(dto: UpdateUserProfileDto): Promise<SafeUser>;
}
