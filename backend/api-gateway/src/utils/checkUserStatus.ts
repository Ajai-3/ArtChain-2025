import axios from 'axios';
import { config } from '../config/env';
import { ForbiddenError } from 'art-chain-shared';
import { logger } from './logger';
import { ROUTES } from '../constants/routes';

export const USER_STATUS_MESSAGES = {
  BANNED: "Your account is banned.",
  SUSPENDED: "Your account is suspended. You can only view content.",
};

export const checkUserStatus = async (
  userId: string,
  method: string,
  contextName: string = 'auth'
) => {
  try {
    const route = ROUTES.USER.PROFILE_BY_ID_SERVICE.replace(':userId', userId);
    const url = `${config.services.main}${route}`;
    
    const { data } = await axios.get(url);
    const userStatus = data?.data?.status;

    if (userStatus === 'banned') {
      throw new ForbiddenError(USER_STATUS_MESSAGES.BANNED);
    }

    if (userStatus === 'suspended' && method !== 'GET') {
      throw new ForbiddenError(USER_STATUS_MESSAGES.SUSPENDED);
    }
  } catch (err) {
    if (err instanceof ForbiddenError) throw err;
    const error = err as Error;
    logger.error(`Failed to fetch user status in ${contextName} middleware: ${error.message}`);
  }
};
