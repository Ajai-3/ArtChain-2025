import { VerifyEmailTokenRequestDto } from '../../../dtos/user/security/VerifyEmailTokenRequestDto';
import { VerifyEmailTokenResponse } from '../../../../../types/responses/user/VerifyEmailTokenResponse';

export interface IVerifyEmailTokenUserUseCase {
    execute(data: VerifyEmailTokenRequestDto): Promise<VerifyEmailTokenResponse>;
}