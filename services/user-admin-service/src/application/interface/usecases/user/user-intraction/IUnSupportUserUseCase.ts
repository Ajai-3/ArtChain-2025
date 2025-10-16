import { SupportUnSupportRequestDto } from '../../../dtos/user/user-intraction/SupportUnSupportRequestDto';

export interface IUnSupportUserUseCase {
  execute(data: SupportUnSupportRequestDto): Promise<any>;
}
