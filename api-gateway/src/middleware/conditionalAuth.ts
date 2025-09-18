import { authUser } from "./authUser";
import { match } from "path-to-regexp";
import { adminAuth } from "./adminAuth";
import { Request, Response, NextFunction } from "express";
import { authRoutesConfig } from "../config/authRoutes.config";
import { optionalAuthUser } from "./optionalAuthUser";

export function conditionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const path = req.path;
  const method = req.method.toUpperCase();

  const matchRoute = (routes: { path: string; methods: string[] }[]) =>
    routes.some((route) => {
      const isMatch = match(route.path, { end: true })(path);
      match;
      return isMatch && route.methods.includes(method);
    });

  console.log("f");
  if (matchRoute(authRoutesConfig.user_optional)) {
    console.log("user_optional");

    return optionalAuthUser(req, res, next);
  }

  if (matchRoute(authRoutesConfig.user)) {
    console.log("uaer_auth_middleware");
    return authUser(req, res, next);
  }

  if (matchRoute(authRoutesConfig.admin)) {
    console.log("admi_auth_middleware");
    return adminAuth(req, res, next);
  }

  next();
}
