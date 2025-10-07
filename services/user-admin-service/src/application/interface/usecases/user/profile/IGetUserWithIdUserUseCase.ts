import { GetUserProfileRequestDto } from "../../../dtos/user/profile/GetUserProfileRequestDto";

export interface IGetUserWithIdUserUseCase {
  execute(data: GetUserProfileRequestDto): Promise<any>;
}