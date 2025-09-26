import { IArtistRequestRepository } from "../../../domain/repositories/user/IArtistRequestRepository";
import { BaseRepositoryImpl } from "../BaseRepositoryImpl";
import { ArtistRequest } from "../../../domain/entities/ArtistRequest";
import { prisma } from "../../db/prisma";

export class ArtistRequestRepositoryImpl
  extends BaseRepositoryImpl
  implements IArtistRequestRepository
{
  protected model = prisma.artistRequest;

  async findById(id: string): Promise<ArtistRequest | null> {
    return await this.model.findUnique({ where: { id } });
  }

  // Create a new artist request
  async createArtistRequest(data: any): Promise<ArtistRequest> {
    const record = await this.model.create({ data });
    return record;
  }

  // Approve a request
  async approve(requestId: string): Promise<void> {
    await this.model.update({
      where: { id: requestId },
      data: { status: "approved", reviewedAt: new Date() },
    });
  }

  // Reject a request with reason
  async reject(requestId: string, reason: string): Promise<void> {
    await this.model.update({
      where: { id: requestId },
      data: {
        status: "rejected",
        rejectionReason: reason,
        reviewedAt: new Date(),
      },
    });
  }

  // Get all pending requests
  async getPendingRequests(): Promise<ArtistRequest[]> {
    return this.model.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get requests by user
  async getByUser(userId: string): Promise<ArtistRequest[]> {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getArtistRequests(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await this.model.count();

    const requests = await this.model.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: { status: "pending" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: requests,
    };
  }
}
