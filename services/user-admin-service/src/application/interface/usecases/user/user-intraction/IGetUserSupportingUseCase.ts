import { UserPreview } from '../../../../../types/UserPreview';

export interface IGetUserSupportingUseCase {
  execute(currentUserId: string, userId: string, page?: number, limit?: number): Promise<UserPreview[]>;
}