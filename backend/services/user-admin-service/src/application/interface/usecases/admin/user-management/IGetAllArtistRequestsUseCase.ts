import { GetAllUsersQueryDto } from "../../../dtos/admin/GetAllUsersQueryDTO";
export interface IGetAllArtistRequestsUseCase {
  execute(query: GetAllUsersQueryDto): Promise<any>;
}
