import { UpdateUserProfileDto } from "../../../dtos/user/profile/UpdateUserProfileDTO";

export interface IUpdateProfileUserUseCase {
  execute(dto: UpdateUserProfileDto): Promise<any>;
}