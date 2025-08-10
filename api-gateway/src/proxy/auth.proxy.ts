import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

console.log("User service target:", config.services.main)

export const authProxy = createProxyMiddleware({
  target: `${config.services.main}/api/v1/auth`,
  changeOrigin: true,
  pathRewrite: { 
    "^/api/v1/auth": ""
  },
}); 
