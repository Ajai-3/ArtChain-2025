import { GetCurrentUserResultDto } from "../../../dtos/user/user-intraction/GetCurrentUserResultDto";

export interface IGetCurrentUserUseCase {
    execute(userId: string): Promise<GetCurrentUserResultDto>
}