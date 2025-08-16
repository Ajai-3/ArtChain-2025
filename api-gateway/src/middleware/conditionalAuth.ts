import { authUser } from "./authUser";
import { adminAuth } from "./adminAuth";
import { Request, Response, NextFunction } from "express"
import { authRoutesConfig } from "../config/authRoutes.config";

export function conditionalAuth(req: Request, res: Response, next: NextFunction) {
  const path = req.path;

  if (authRoutesConfig.user.some(route => path.startsWith(route))) {
    return authUser(req, res, next);
  }

  if (authRoutesConfig.admin.some(route => path.startsWith(route))) {
    return adminAuth(req, res, next);
  }

  next();
}
