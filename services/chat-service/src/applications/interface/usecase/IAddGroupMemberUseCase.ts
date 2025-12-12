import { AddGroupAdminDto } from "../dto/AddGroupAdminDto";

export interface IAddGroupMemberUseCase {
  execute(dto: AddGroupAdminDto): Promise<boolean>;
}
