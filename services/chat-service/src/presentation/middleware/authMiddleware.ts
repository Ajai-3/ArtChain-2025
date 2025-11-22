import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { env } from "../../infrastructure/config/env";
import { logger } from "../../infrastructure/utils/logger";
import { ERROR_MESSAGES } from "../../constants/messages";

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      logger.error("Socket.IO user token is missing");
      return next(new Error(ERROR_MESSAGES.AUTHENTICATION_ERROR_TOKEN_MISSING));
    }

    console.log("🔍 JWT Secret:", env.jwt.accessSecret);
    const decoded = jwt.verify(token, env.jwt.accessSecret) as { id: string };

    console.log("🔍 Decoded token:", decoded);
    socket.data.userId = decoded.id;

    logger.info("✅ Socket authenticated for user:", socket.data.userId);
    next();
  } catch (err) {
    logger.error("❌ Invalid token:", err);
    next(new Error(ERROR_MESSAGES.AUTHENTICATION_ERROR));
  }
};
