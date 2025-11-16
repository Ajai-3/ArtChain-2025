import { UserDto } from "../dto/MessageResponseDto";

export interface IUserService {
  getUsersByIds(ids: string[]): Promise<UserDto[] | null>;
}