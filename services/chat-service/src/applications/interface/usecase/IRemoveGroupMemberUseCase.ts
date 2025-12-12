import { RemoveGroupMemberDto } from "../dto/RemoveGroupMemberDto";

export interface IRemoveGroupMemberUseCase {
  execute(dto: RemoveGroupMemberDto): Promise<boolean>;
}
