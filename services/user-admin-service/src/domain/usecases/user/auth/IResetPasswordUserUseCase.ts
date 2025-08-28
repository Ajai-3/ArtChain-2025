import { ResetPasswordRequestDto } from '../../../dtos/user/auth/ResetPasswordRequestDto';

export interface IResetPasswordUserUseCase {
  execute(data: ResetPasswordRequestDto): Promise<void>;
}