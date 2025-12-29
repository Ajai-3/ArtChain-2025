import { UserPreview } from '../../../../../types/UserPreview';
import { GetSupportingRequestDto } from '../../../dtos/user/user-intraction/GetSupportingRequestDto';

export interface IGetUserSupportingUseCase {
  execute(dto: GetSupportingRequestDto): Promise<UserPreview[]>;
}