import axios from "axios";
import { env } from "../config/env"
import { injectable } from "inversify";
import { UserDto } from "../../applications/interface/dto/MessageResponseDto";
import { IUserService } from "../../applications/interface/http/IUserService";
import { mapToUserDto } from "../../applications/mappers/mapUser";
import { ROUTES, buildUserServiceRoute } from "../../constants/routes";

@injectable()
export class UserService implements IUserService {
  private readonly baseUrl = env.user_service_url;

  async getUserById(userId: string): Promise<UserDto> {
    try {
      const route = buildUserServiceRoute(ROUTES.EXTERNAL.USER.PROFILE_BY_ID, { userId });
      const res = await axios.get<{ data: UserDto }>(
        `${this.baseUrl}${route}`
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
        `${this.baseUrl}${ROUTES.EXTERNAL.USER.BATCH}`,
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
