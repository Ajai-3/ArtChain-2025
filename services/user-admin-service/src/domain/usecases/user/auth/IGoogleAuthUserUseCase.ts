import { AuthResultDto } from "../../../dtos/user/auth/AuthResultDto";
import { GoogleAuthRequestDto } from "../../../dtos/user/auth/GoogleAuthRequestDto";


export interface IGoogleAuthUserUseCase {
  execute(data: GoogleAuthRequestDto): Promise<AuthResultDto>;
}
