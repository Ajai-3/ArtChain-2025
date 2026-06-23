import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { config } from '../../infrastructure/config/env';
import { logger } from '../../infrastructure/utils/logger';
import { AuthenticatedSocket } from '../../types';

export const authSocket = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      logger.error('Socet io user token is missing');
      return next(new Error('Authentication error: Token missing'));
    }
    const decode = jwt.verify(token, config.jwt.accessSecret) as {
      id: string;
    };

    logger.debug('Decoded token:', { decode });

    (socket as unknown as AuthenticatedSocket).userId = decode?.id;
    next();
  } catch (err) {
    logger.error('Invalid token : ', err);
  }
};
