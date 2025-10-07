import { VerifyEmailTokenRequestDto } from '../../../dtos/user/security/VerifyEmailTokenRequestDto';
import { SafeUser } from '../../../../../domain/repositories/IBaseRepository';

export interface IVerifyEmailTokenUserUseCase {
    execute(data: VerifyEmailTokenRequestDto): Promise<any>;
}