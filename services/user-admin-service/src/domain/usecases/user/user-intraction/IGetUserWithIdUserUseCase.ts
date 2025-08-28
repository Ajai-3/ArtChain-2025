import { GetUserProfileWithIdResultDto } from "../../../dtos/user/user-intraction/GetUserProfileWithIdResultDto";
import { GetUserProfileWithIdRequestDto } from "../../../dtos/user/user-intraction/GetUserProfileWithIdRequestDto";

export interface IGetUserWithIdUserUseCase {
    execute(data: GetUserProfileWithIdRequestDto): Promise<GetUserProfileWithIdResultDto>
}