import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { config } from "../../infrastructure/config/env";
import { logger } from "../../utils/logger";

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      logger.error("Socket.IO user token is missing");
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = jwt.verify(token, config.jwt_secret) as { id: string };

    console.log(decoded, token);

    socket.data.userId = decoded.id;

    logger.info(`✅ Socket authenticated for user: ${socket.data.userId}`);
    next();
  } catch (err) {
    logger.error("❌ Invalid token:", err);
    next(new Error("Authentication error: Invalid token"));
  }
};
