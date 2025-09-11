import { authUser } from "./authUser";
import { adminAuth } from "./adminAuth";
import { Request, Response, NextFunction } from "express"
import { authRoutesConfig } from "../config/authRoutes.config";
import { optionalAuthUser } from "./optionalAuthUser";

export function conditionalAuth(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  const method = req.method.toUpperCase();

  const matchRoute = (routes: { path: string; methods: string[] }[]) =>
    routes.some(route => path.startsWith(route.path) && route.methods.includes(method));

  if (matchRoute(authRoutesConfig.user_optional)) {
    return optionalAuthUser(req, res, next);
  }

  if (matchRoute(authRoutesConfig.user)) {
    return authUser(req, res, next);
  }

  if (matchRoute(authRoutesConfig.admin)) {
    return adminAuth(req, res, next);
  }

  next();
}
