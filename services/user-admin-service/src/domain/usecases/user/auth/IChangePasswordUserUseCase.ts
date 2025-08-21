import { ChangePasswordRequestDto } from "../../../dtos/user/auth/ChangePasswordRequestDto";

export interface IChangePasswordUserUseCase {
  execute(data: ChangePasswordRequestDto): Promise<void>;
}
