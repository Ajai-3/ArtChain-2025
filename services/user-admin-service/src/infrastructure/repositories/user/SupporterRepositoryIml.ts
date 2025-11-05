import { injectable } from 'inversify';
import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { ISupporterRepository } from '../../../domain/repositories/user/ISupporterRepository';
import { UserPreview } from '../../../types/UserPreview';

@injectable()
export class SupporterRepositoryImpl
  extends BaseRepositoryImpl
  implements ISupporterRepository
{
  protected model = prisma.supporter;

  async getUserSupportersAndSupportingCounts(userId: string): Promise<{
    supportersCount: number;
    supportingCount: number;
  }> {
    const supportersCount = await this.model.count({
      where: { targetUserId: userId , supporterId: { not: userId }, },
    });

    const supportingCount = await this.model.count({
      where: { supporterId: userId, targetUserId: { not: userId },  },
    });

    return { supportersCount, supportingCount };
  }

  async addSupport(supporterId: string, targetUserId: string): Promise<void> {
    await this.model.create({
      data: {
        supporterId,
        targetUserId,
      },
    });
  }

  async removeSupport(
    supporterId: string,
    targetUserId: string
  ): Promise<void> {
    await this.model.delete({
      where: {
        supporterId_targetUserId: {
          supporterId,
          targetUserId,
        },
      },
    });
  }

  async isSupporting(
    currentUserId: string,
    targetUserId: string
  ): Promise<boolean> {
    const count = await this.model.count({
      where: {
        supporterId: currentUserId,
        targetUserId: targetUserId,
      },
    });

    return count > 0;
  }

  async getSupporters(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<UserPreview[]> {
    const skip = (page - 1) * limit;

    const supporters = await this.model.findMany({
      where: { targetUserId: userId },
      select: {
        supporter: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            role: true,
            plan: true,
          },
        },
      },
      take: limit,
      skip: skip,
    });

    return supporters.map((s: any) => s.supporter);
  }

  async getSupporting(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<UserPreview[]> {
    const skip = (page - 1) * limit;

    const supporting = await this.model.findMany({
      where: { supporterId: userId },
      select: {
        targetUser: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            role: true,
            plan: true,
          },
        },
      },
      take: limit,
      skip: skip,
    });

    return supporting.map((s: any) => s.targetUser);
  }

  async getSupportingIds(userId: string): Promise<string[]> {
    const rows = await prisma.supporter.findMany({
      where: { supporterId: userId },
      select: { targetUserId: true },
    });

    return rows.map((r) => r.targetUserId);
  }
}
