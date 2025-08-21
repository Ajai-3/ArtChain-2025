import { ForgotPasswordResultDto } from "../../../dtos/user/auth/ForgotPasswordResultDto";

export interface IForgotPasswordUserUseCase {
  execute(identifier: string): Promise<ForgotPasswordResultDto>;
}
