import { UserPreview } from '../../../../../types/UserPreview';
import { GetSupportersRequestDto } from '../../../dtos/user/user-intraction/GetSupportersRequestDto';

export interface IGetUserSupportersUseCase {
  execute(dto: GetSupportersRequestDto): Promise<UserPreview[]>;
}