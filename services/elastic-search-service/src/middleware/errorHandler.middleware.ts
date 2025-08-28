import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "art-chain-shared";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught in middleware:", err);

  const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message =
    err.message || ELASTIC_MESSAGES.INTERNAL_SERVER_ERROR || "Unexpected error";

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
