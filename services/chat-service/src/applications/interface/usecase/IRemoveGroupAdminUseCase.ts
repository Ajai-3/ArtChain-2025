import { AddGroupAdminDto } from "../dto/AddGroupAdminDto";

export interface IRemoveGroupAdminUseCase {
  execute(dto: AddGroupAdminDto): Promise<boolean>;
}
