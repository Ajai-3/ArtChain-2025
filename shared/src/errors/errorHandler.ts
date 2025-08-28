import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { AppError, ValidationError } from "../errors";
import chalk from "chalk";

export const createErrorHandler = (isProduction: boolean) => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(chalk.redBright("ERROR.........."))
    console.error(chalk.red(`[ERROR] ${req.method} ${req.path}:`), err);

       const statusCode = err.statusCode || 500;
    const code = err.code || err.name || "InternalServerError";
    const message =
      err instanceof AppError || err instanceof ValidationError
        ? err.message
        : ERROR_MESSAGES.SERVER_ERROR;

    const response = {
      statusCode,
      body: {
        status: "error",
        error: {
          code,
          message,
          statusCode,
        },
      },
    };

    res.status(statusCode).json(response);
  };
};
