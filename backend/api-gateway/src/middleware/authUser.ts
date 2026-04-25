import { logger } from '../utils/logger';
import { checkUserStatus } from '../utils/checkUserStatus';
import { tokenService } from '../service/tokenService';
import { Response, NextFunction } from 'express';
import { TokenPayload, AuthenticatedRequest } from '../types/TokenPayload';
import {
  ERROR_MESSAGES,
  ForbiddenError,
  HttpStatus,
  UnauthorizedError,
} from 'art-chain-shared';



export const authUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.MISSING_ACCESS_TOKEN);
    }

    const decoded = tokenService.verifyAccessToken(accessToken) as TokenPayload | null;

    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
    }
    
    if (decoded.role !== 'user' && decoded.role !== 'artist' && decoded.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_USER_ROLE);
    }

    await checkUserStatus(decoded.id, req.method, 'auth');

    req.headers['x-user-id'] = decoded.id;


    req.user = decoded;
    logger.info(`User auth middleware called ${req.path} - ${req.method}`);
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: error.message,
      });
    }
    if (error instanceof ForbiddenError) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: error.message,
      });
    }
    logger.error('Authentication error:', { error });
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
