import { RefreshTokenResultDto } from '../../../dtos/user/auth/RefreshTokenResultDto';


export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<RefreshTokenResultDto>;
}
