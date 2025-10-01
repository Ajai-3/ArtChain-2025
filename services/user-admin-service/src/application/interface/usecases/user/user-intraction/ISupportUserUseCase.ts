import { SupportUnSupportRequestDto } from "../../../dtos/user/user-intraction/SupportUnSupportRequestDto";
import { SupportResultDto } from '../../../dtos/user/user-intraction/SupportResultDto';

export interface ISupportUserUseCase {
  execute(data: SupportUnSupportRequestDto): Promise<SupportResultDto>;
}
