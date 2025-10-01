import { GetAllUsersQueryDTO } from "../../../dtos/admin/GetAllUsersQueryDTO";

export interface IGetAllUsersUseCase {
  execute(query: GetAllUsersQueryDTO): Promise<any>;
}
