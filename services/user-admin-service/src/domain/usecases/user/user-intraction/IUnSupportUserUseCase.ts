import { SupportUnSupportRequestDto } from "../../../../domain/dtos/user/user-intraction/SupportUnSupportRequestDto";
import { SupportResultDto } from "../../../dtos/user/user-intraction/SupportResultDto";

export interface IUnSupportUserUseCase {
  execute(data: SupportUnSupportRequestDto): Promise<void>;
}
