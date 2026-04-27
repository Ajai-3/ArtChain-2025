import { inject, injectable } from 'inversify';
import { mapCdnUrl } from '../../../../utils/mapCdnUrl';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { GetAllUsersQueryDto } from '../../../interface/dtos/admin/GetAllUsersQueryDTO';
import { IArtistRequestRepository } from '../../../../domain/repositories/user/IArtistRequestRepository';
import { IGetAllArtistRequestsUseCase } from '../../../interface/usecases/admin/user-management/IGetAllArtistRequestsUseCase';
import { ArtistRequestWithUser } from '../../../../types';
import { GetAllArtistRequestsResponse } from '../../../../types/responses/admin/GetAllArtistRequestsResponse';
import { ILogger } from '../../../interface/ILogger';

@injectable()
export class GetAllArtistRequestsUseCase
  implements IGetAllArtistRequestsUseCase
{
  constructor(
    @inject(TYPES.IArtistRequestRepository)
    private readonly _artistRepo: IArtistRequestRepository,
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
  ) {}

  async execute(query: GetAllUsersQueryDto): Promise<GetAllArtistRequestsResponse> {
    const { page = 1, limit = 8 } = query;

    this._logger.info('Fetching artist requests', { page, limit });

    const result = await this._artistRepo.getArtistRequests(page, limit);

    this._logger.info('Artist requests fetched', {
      page,
      limit,
      total: result.meta.total,
    });

    return {
      ...result,
      data: result.data.map((request: ArtistRequestWithUser) => ({
        ...request,
        user: {
          ...request.user,
          profileImage: mapCdnUrl(request.user?.profileImage) ?? null,
        },
      })),
    };
  }
}
