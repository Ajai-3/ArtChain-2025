import { GetAllUsersQueryDTO } from '../../../dtos/admin/GetAllUsersQueryDTO';
export interface IGetAllArtistRequestsUseCase {
    execute(query: GetAllUsersQueryDTO): Promise<any>
}