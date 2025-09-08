import { Request, Response, NextFunction } from 'express';
import { logger } from '../../infrastructure/utils/logger';
import { ZodError } from 'zod';
import { HttpStatus } from 'art-chain-shared';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => issue.message).join(', ');
    logger.warn(
      `Validation failed | userId=${req.headers['x-user-id'] || 'unknown'} | reason=${messages}`
    );
    return res.status(HttpStatus.BAD_REQUEST).json({ errors: err.issues });
  }

  logger.error(`Unhandled error | message=${err.message} | stack=${err.stack}`);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal server error' });
};
