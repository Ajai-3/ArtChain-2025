import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { env } from "../../infrastructure/config/env";
import { logger } from "../../infrastructure/utils/logger";

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      logger.error("Socket.IO user token is missing");
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = jwt.verify(token, env.jwt.accessSecret) as { id: string };
    socket.data.userId = decoded.id;

    logger.debug("Socket.IO user authenticated:", decoded.id);
    next();
  } catch (err) {
    logger.error("Invalid token:", err);
    next(new Error("Authentication error"));
  }
};
