import { GetGroupMembersDto } from "../dto/GetGroupMembersDto";

export interface IGetGroupMembersUseCase {
  execute(dto: GetGroupMembersDto): Promise<any>;
}
