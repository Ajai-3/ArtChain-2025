import { Request, Response } from 'express';
import { HttpStatus } from 'art-chain-shared';
import { ELASTIC_MESSAGES } from '../constants/elasticMesages.constants';
import { AppError } from '../types';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
) => {
  const error = err as AppError;
  console.error('Error caught in middleware:', error);

  const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message =
    error.message || ELASTIC_MESSAGES.INTERNAL_SERVER_ERROR || 'Unexpected error';

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};
