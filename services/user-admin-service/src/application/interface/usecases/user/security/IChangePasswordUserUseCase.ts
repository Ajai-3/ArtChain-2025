import { ChangePasswordRequestDto } from '../../../dtos/user/security/ChangePasswordRequestDto';

export interface IChangePasswordUserUseCase {
  execute(data: ChangePasswordRequestDto): Promise<void>;
}
