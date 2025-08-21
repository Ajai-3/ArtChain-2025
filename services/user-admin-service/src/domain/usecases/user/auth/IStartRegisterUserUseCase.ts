import { StartRegisterResultDto } from "../../../dtos/user/auth/StartRegisterResultDto";
import { StartRegisterRequestDto } from "../../../dtos/user/auth/StartRegisterRequestDto";

export interface IStartRegisterUserUseCase {
  execute(data: StartRegisterRequestDto): Promise<StartRegisterResultDto>;
}
