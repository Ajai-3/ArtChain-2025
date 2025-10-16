import { ChangeEmailDto } from '../../../dtos/user/security/ChangeEmailDto';

export interface IChangeEmailUserUseCase {
    execute(data: ChangeEmailDto): Promise<any>
}