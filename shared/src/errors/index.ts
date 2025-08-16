import { HttpStatus } from '../constants/httpStatus';

type ErrorDetails = Record<string, unknown> | unknown[];

export class AppError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly details?: ErrorDetails;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    message: string,
    statusCode: HttpStatus,
    details?: ErrorDetails,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, new.target);
  }
}

//#==================================================================================================================
// START VALIDATION ERROR
//#==================================================================================================================

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', details?: ErrorDetails) {
    super('BadRequestError', message, HttpStatus.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: ErrorDetails) {
    super('UnauthorizedError', message, HttpStatus.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: ErrorDetails) {
    super('ForbiddenError', message, HttpStatus.FORBIDDEN, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found', details?: ErrorDetails) {
    super('NotFoundError', message, HttpStatus.NOT_FOUND, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', details?: ErrorDetails) {
    super('ConflictError', message, HttpStatus.CONFLICT, details);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = 'Internal Server Error',
    details?: ErrorDetails
  ) {
    super(
      'InternalServerError',
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
      false
    );
  }
}

export class ValidationError extends BadRequestError {
  constructor(
    message: string = 'Validation failed',
    public readonly details?: Array<{
      field: string;
      message: string;
    }>
  ) {
    super(message, details);
    this.name = 'ValidationError';
  }
}