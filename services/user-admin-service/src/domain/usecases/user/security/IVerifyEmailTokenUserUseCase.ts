import { VerifyEmailTokenRequestDto } from "../../../dtos/user/security/VerifyEmailTokenRequestDto";
import { SafeUser } from "../../../repositories/IBaseRepository";

export interface IVerifyEmailTokenUserUseCase {
    execute(data: VerifyEmailTokenRequestDto): Promise<any>;
}