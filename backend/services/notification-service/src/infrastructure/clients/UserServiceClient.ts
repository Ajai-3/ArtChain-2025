import axios from 'axios';
import { injectable } from 'inversify';
import { logger } from '../../infrastructure/utils/logger';
import { IUserServiceClient, UserDetails } from '../../application/interfaces/clients/IUserServiceClient';

@injectable()
export class UserServiceClient implements IUserServiceClient {
    private readonly _baseUrl: string;

    constructor() {
        this._baseUrl = process.env.API_GATEWAY_URL || '';
    }

    async getUser(userId: string): Promise<UserDetails | null> {
        try {
            const response = await axios.get(`${this._baseUrl}/api/v1/user/profile-id/${userId}`);
            return response.data.data;
        } catch (error) {
            logger.error(`Failed to fetch user ${userId} details`, error);
            return null;
        }
    }

    async getUsers(userIds: string[]): Promise<UserDetails[]> {
        if (userIds.length === 0) return [];
        try {
            const response = await axios.post(`${process.env.API_GATEWAY_URL}/api/v1/user/batch`, {
                ids: userIds
            });
            return response.data.data;
        } catch (error) {
             logger.error('Failed to fetch users batch', error);
             return [];
        }
    }
}
