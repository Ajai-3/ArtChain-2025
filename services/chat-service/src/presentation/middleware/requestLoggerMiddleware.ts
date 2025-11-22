import { Request, Response, NextFunction } from "express";
import { logger } from "../../infrastructure/utils/logger";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  const basicInfo = {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.socket.remoteAddress,
    userId: req.headers["x-user-id"],
    userAgent: req.get("user-agent"),
  };


  logger.info(`Incoming HTTP request: ${JSON.stringify(basicInfo)}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = { ...basicInfo, duration, statusCode: res.statusCode };

    if (res.statusCode >= 500) {
      logger.error(`Server error: ${JSON.stringify(logData)}`);
    } else if (res.statusCode >= 400) {
      logger.warn(`Client error: ${JSON.stringify(logData)}`);
    } else {
      logger.info(`Request completed: ${JSON.stringify(logData)}`);
    }
  });

  res.on("close", () => {
    if (!res.writableEnded) {
      const duration = Date.now() - start;
      logger.warn(
        `Request closed before completion: ${JSON.stringify({ ...basicInfo, duration })}`
      );
    }
  });

  next();
};
