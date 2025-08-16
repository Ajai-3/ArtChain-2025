import { prisma } from "../../db/prisma";
import { BaseRepositoryImpl } from "../BaseRepositoryImpl";
import { ISupporterRepository } from "../../../domain/repositories/user/ISupporterRepository";
import { UserPreview } from "../../../types/UserPreview";

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
      where: { targetUserId: userId },
    });

    const supportingCount = await this.model.count({
      where: { supporterId: userId },
    });

    return { supportersCount, supportingCount };
  }

  async getSupporters(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<UserPreview[]> {
    const skip = page && limit ? (page - 1) * limit : undefined;

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
    page?: number,
    limit?: number
  ): Promise<UserPreview[]> {
    const skip = page && limit ? (page - 1) * limit : undefined;

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
          },
        },
      },
      take: limit,
      skip: skip,
    });

    return supporting.map((s: any) => s.targetUser);
  }
}
