import { GetAllUsersQueryDto } from "../../../dtos/admin/GetAllUsersQueryDTO";

export interface IGetAllUsersUseCase {
  execute(query: GetAllUsersQueryDto): Promise<any>;
}
