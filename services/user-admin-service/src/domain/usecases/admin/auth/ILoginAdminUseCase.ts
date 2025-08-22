import { AuthResultDto } from "../../../dtos/user/auth/AuthResultDto";
import { LoginRequestDto } from "../../../dtos/user/auth/LoginRequestDto";

export interface ILoginAdminUseCase {
  execute(data: LoginRequestDto): Promise<AuthResultDto>;
}
