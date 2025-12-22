import { InitializeAuthResultDto } from '../../../dtos/user/auth/InitializeAuthResultDto';

export interface IInitializeAuthUseCase {
  execute(refreshToken: string): Promise<InitializeAuthResultDto>;
}
