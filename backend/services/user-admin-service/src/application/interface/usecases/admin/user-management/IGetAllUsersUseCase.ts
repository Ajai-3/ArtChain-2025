import { GetAllUsersQueryDto } from '../../../dtos/admin/GetAllUsersQueryDTO';
import { GetUsersResponse } from '../../../../../types';

export interface IGetAllUsersUseCase {
  execute(query: GetAllUsersQueryDto): Promise<GetUsersResponse>;
}
