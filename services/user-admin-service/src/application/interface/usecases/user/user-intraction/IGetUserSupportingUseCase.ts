import { UserPreview } from '../../../../../types/UserPreview';

export interface IGetUserSupportingUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<UserPreview[]>;
}