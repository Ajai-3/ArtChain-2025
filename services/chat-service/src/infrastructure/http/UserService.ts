import axios from "axios";
import { env } from "../config/env"
import { injectable } from "inversify";
import { UserDto } from "../../applications/interface/dto/MessageResponseDto";
import { IUserService } from "../../applications/interface/http/IUserService";
import { mapToUserDto } from "../../applications/mappers/mapUser";

@injectable()
export class UserService implements IUserService {
  private readonly baseUrl = env.user_service_url;

  async getUserById(userId: string): Promise<UserDto> {
    try {
      const res = await axios.get<{ data: UserDto }>(
        `${this.baseUrl}/api/v1/user/profile-id/${userId}`
      );
      return mapToUserDto(res.data.data);
    } catch (err) {
      return {} as UserDto;
    }
  }

  async getUsersByIds(userIds: string[]): Promise<UserDto[]> {
    if (!userIds.length) return [];
    try {
      const res = await axios.post<{ data: UserDto[] }>(
        `${this.baseUrl}/api/v1/user/batch`,
        {
          ids: userIds,
        }
      );
      console.log(res.data, "getUsersByIds");
      return res.data.data;
    } catch (err) {
      return [];
    }
  }
}
