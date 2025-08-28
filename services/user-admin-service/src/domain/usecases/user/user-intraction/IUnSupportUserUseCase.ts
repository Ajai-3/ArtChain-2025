import { SupportUnSupportRequestDto } from "../../../../domain/dtos/user/user-intraction/SupportUnSupportRequestDto";

export interface IUnSupportUserUseCase {
  execute(data: SupportUnSupportRequestDto): Promise<void>;
}
