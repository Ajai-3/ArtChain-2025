import { UserPreview } from '../../../../../types/UserPreview';

export interface IGetUserSupportersUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<UserPreview[]>;
}