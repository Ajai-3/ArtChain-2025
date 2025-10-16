import { GetAllUsersQueryDto } from '../../../dtos/admin/GetAllUsersQueryDto';
export interface IGetAllArtistRequestsUseCase {
  execute(query: GetAllUsersQueryDto): Promise<any>;
}
