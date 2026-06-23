import axios, { AxiosError } from 'axios';
import { config } from '../config/env';
import { injectable } from 'inversify';
import { IUserService } from '../../application/interface/service/IUserService';
import type { ApiGatewayResponse } from '../../types/gateway';
import type { UserPublicProfile } from '../../types/user';
import { SERVICE_MESSAGES, SERVICE_ROUTES } from '../../constants/ServiceMessages';

@injectable()
export class UserService implements IUserService {
  async getUserById(
    userId: string,
    currentUserId?: string,
  ): Promise<UserPublicProfile | null> {
    try {
      const response = await axios.get<ApiGatewayResponse<UserPublicProfile>>(
        `${config.api_gateway_url}${SERVICE_ROUTES.USER_PROFILE_ID(userId)}`,
        {
          headers: {
            'x-user-id': currentUserId,
          },
        },
      );
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getUsersByIds(
    userIds: string[],
    currentUserId?: string,
  ): Promise<UserPublicProfile[]> {
    try {
      const response = await axios.post<ApiGatewayResponse<UserPublicProfile[]>>(
        `${config.api_gateway_url}${SERVICE_ROUTES.USER_BATCH}`,
        { ids: userIds, currentUserId },
      );
      return response.data.data || [];
    } catch (error) {
      return [];
    }
  }

  async getUserByUsername(username: string): Promise<UserPublicProfile | null> {
    try {
      const response = await axios.get<ApiGatewayResponse<UserPublicProfile>>(
        `${config.api_gateway_url}${SERVICE_ROUTES.USER_PROFILE_USERNAME(username)}`,
      );
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 404) {
        return null;
      }
      throw error;
    }
  }
}