import { UserPreview } from '../../../../../types/UserPreview';

export interface IGetUserSupportersUseCase {
  execute(currentUserId: string, userId: string, page?: number, limit?: number): Promise<UserPreview[]>;
}