import { AddGroupAdminDto } from "../dto/AddGroupAdminDto";

export interface IAddGroupAdminUseCase {
  execute(dto: AddGroupAdminDto): Promise<boolean>;
}
