import { GetGroupMembersDto } from '../dto/GetGroupMembersDto';
import { UserDto } from '../dto/MessageResponseDto';

export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface GroupMemberWithRole extends UserDto {
  role: MemberRole;
}

export interface GetGroupMembersResponse {
  members: GroupMemberWithRole[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface IGetGroupMembersUseCase {
  execute(dto: GetGroupMembersDto): Promise<GetGroupMembersResponse>;
}
