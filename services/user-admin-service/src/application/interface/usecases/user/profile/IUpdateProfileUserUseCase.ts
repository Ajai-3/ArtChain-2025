import { UpdateUserProfileDto } from "../../../dtos/user/profile/UpdateUserProfileDto";

export interface IUpdateProfileUserUseCase {
  execute(dto: UpdateUserProfileDto): Promise<any>; 
}