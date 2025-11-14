import { inject, injectable } from 'inversify';
import { mapCdnUrl } from '../../../../utils/mapCdnUrl';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { GetAllUsersQueryDto } from '../../../interface/dtos/admin/GetAllUsersQueryDto';
import { IArtistRequestRepository } from '../../../../domain/repositories/user/IArtistRequestRepository';
import { IGetAllArtistRequestsUseCase } from '../../../interface/usecases/admin/user-management/IGetAllArtistRequestsUseCase';

@injectable()
export class GetAllArtistRequestsUseCase
  implements IGetAllArtistRequestsUseCase
{
  constructor(
    @inject(TYPES.IArtistRequestRepository)
    private readonly _artistRepo: IArtistRequestRepository
  ) {}

  async execute(query: GetAllUsersQueryDto): Promise<any> {
    const { page = 1, limit = 8 } = query;
    const result = await this._artistRepo.getArtistRequests(page, limit);

    return {
      ...result,
      data: result.data.map((request: any) => ({
        ...request,
        user: {
          ...request.user,
          profileImage: mapCdnUrl(request.user?.profileImage) ?? null,
        },
      })),
    };
  }
}
