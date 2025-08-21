import { RefreshTokenResultDto } from '../../../dtos/user/auth/RefreshTokenResultDto';


export interface IRefreshTokenUserUseCase {
  execute(refreshToken: string): Promise<RefreshTokenResultDto>;
}
