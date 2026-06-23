import { tokenService } from '../service/tokenService';
import { Response, NextFunction } from 'express';
import { TokenPayload, AuthenticatedRequest } from '../types/TokenPayload';
import { ERROR_MESSAGES, ForbiddenError, HttpStatus, UnauthorizedError } from 'art-chain-shared';
import { logger } from '../utils/logger';


export const adminAuth = async (
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

    if (decoded.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.ADMIN_REQUIRED);
    }

    req.headers['x-admin-id'] = decoded.id;
    
    req.user = decoded;
    logger.info(`Admin auth middleware called ${req.path} - ${req.method}`);
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
    if (error instanceof ForbiddenError) {
      return res.status(HttpStatus.FORBIDDEN).json({ 
        success: false,
        error: error.message 
      });
    }
    logger.error('Authentication error:', { error });
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(ERROR_MESSAGES.SERVER_ERROR);
  }
};