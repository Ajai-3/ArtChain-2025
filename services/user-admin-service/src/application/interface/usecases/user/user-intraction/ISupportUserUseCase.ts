import { SupportUnSupportRequestDto } from '../../../dtos/user/user-intraction/SupportUnSupportRequestDto';

export interface ISupportUserUseCase {
  execute(data: SupportUnSupportRequestDto): Promise<void>;
}
