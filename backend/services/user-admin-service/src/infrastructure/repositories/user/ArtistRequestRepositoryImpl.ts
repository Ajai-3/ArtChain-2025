import { injectable } from 'inversify';
import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { ArtistRequest } from '../../../domain/entities/ArtistRequest';
import { IArtistRequestRepository } from '../../../domain/repositories/user/IArtistRequestRepository';
import { ArtistRequestCreateInput } from '../../../types';

@injectable()
export class ArtistRequestRepositoryImpl
  extends BaseRepositoryImpl<ArtistRequest>
  implements IArtistRequestRepository
{
  protected model = prisma.artistRequest;

  async findById(id: string): Promise<ArtistRequest | null> {
    const result = await this.model.findUnique({ where: { id } });
    return result as ArtistRequest | null;
  }

  async createArtistRequest(
    data: Omit<ArtistRequest, 'id' | 'createdAt' | 'reviewedAt'>,
  ): Promise<ArtistRequest> {
    const record = await this.model.create({
      data: data as ArtistRequestCreateInput,
    });
    return record as ArtistRequest;
  }

  // Approve a request
  async approve(requestId: string): Promise<ArtistRequest> {
    const result = await this.model.update({
      where: { id: requestId },
      data: { status: 'approved', reviewedAt: new Date() },
    });
    return result as ArtistRequest;
  }

  // Reject a request with reason
  async reject(requestId: string, reason: string): Promise<ArtistRequest> {
    const result = await this.model.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date(),
      },
    });
    return result as ArtistRequest;
  }

  // Get all pending requests
  async getPendingRequests(): Promise<ArtistRequest[]> {
    return this.model.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get requests by user
  async getByUser(userId: string): Promise<ArtistRequest[]> {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getArtistRequests(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await this.model.count();

    const requests = await this.model.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: { status: 'pending' },
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
