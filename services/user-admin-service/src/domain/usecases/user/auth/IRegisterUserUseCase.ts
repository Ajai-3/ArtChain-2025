import { AuthResultDto } from '../../../dtos/user/auth/AuthResultDto';
import { RegisterRequestDto } from '../../../dtos/user/auth/RegisterRequestDto';

export interface IRegisterUserUseCase {
  execute(data: RegisterRequestDto): Promise<AuthResultDto>;
}
