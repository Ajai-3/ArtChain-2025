import { GetAllUsersQueryDto } from '../../../dtos/admin/GetAllUsersQueryDTO';
import { GetAllArtistRequestsResponse } from '../../../../../types/responses/admin/GetAllArtistRequestsResponse';

export interface IGetAllArtistRequestsUseCase {
  execute(query: GetAllUsersQueryDto): Promise<GetAllArtistRequestsResponse>;
}
