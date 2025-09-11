import { tokenService } from "../service/tokenService";
import { Request, Response, NextFunction } from "express";
import {
  ERROR_MESSAGES,
  ForbiddenError,
  HttpStatus,
  UnauthorizedError,
} from "art-chain-shared";
import { decode } from "punycode";

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.MISSING_ACCESS_TOKEN);
    }

    const decoded = tokenService.verifyAccessToken(accessToken);

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_ACCESS_TOKEN);
    }

    if (decoded.role !== "user" && decoded.role !== "artist") {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_USER_ROLE);
    }
    console.log(decoded.id)
    req.headers["x-user-id"] = decoded.id;

    (req as any).user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: error.message,
      });
    }
    if (error instanceof ForbiddenError) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: error.message,
      });
    }
    console.error("Authentication error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
