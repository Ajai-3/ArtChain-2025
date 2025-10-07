import { GetAllUsersQueryDto } from "../../../dtos/admin/GetAllUsersQueryDto";

export interface IGetAllUsersUseCase {
  execute(query: GetAllUsersQueryDto): Promise<any>;
}
