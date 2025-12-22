import { VerifyEmailTokenRequestDto } from '../../../dtos/user/security/VerifyEmailTokenRequestDto';
import { SafeUser } from '../../../../../domain/entities/User';

export interface IVerifyEmailTokenUserUseCase {
    execute(data: VerifyEmailTokenRequestDto): Promise<any>;
}