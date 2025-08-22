import { GetAllUsersQueryDTO } from '../../../../domain/dtos/admin/GetAllUsersQueryDTO';

export interface IGetAllUsersUseCase {
  execute(query: GetAllUsersQueryDTO): Promise<any>;
}
