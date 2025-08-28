import { IBaseRepository } from './../IBaseRepository';
import { UserPreview } from '../../../types/UserPreview';

export interface ISupporterRepository extends IBaseRepository {
  getUserSupportersAndSupportingCounts(userId: string): Promise<{
    supportersCount: number;
    supportingCount: number;
  }>;

  isSupporting(currentUserId: string, targetUserId: string): Promise<boolean>
  addSupport(supporterId: string, targetUserId: string): Promise<void>;
  removeSupport(supporterId: string, targetUserId: string): Promise<void>;

  getSupporters(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<UserPreview[]>;

  getSupporting(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<UserPreview[]>;
}
