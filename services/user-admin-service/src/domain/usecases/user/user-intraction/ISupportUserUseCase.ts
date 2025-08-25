import { SupportUnSupportRequestDto } from "../../../../domain/dtos/user/user-intraction/SupportUnSupportRequestDto";

export interface ISupportUserUseCase {
  execute(data: SupportUnSupportRequestDto): Promise<void>;
}
