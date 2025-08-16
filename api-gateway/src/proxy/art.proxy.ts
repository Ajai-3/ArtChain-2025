import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

console.log("Art service target:", config.services.art)

export const artProxy = createProxyMiddleware({
  target: `${config.services.art}/api/v1/art`,
  changeOrigin: true,
  pathRewrite: { 
    "^/api/v1/art": ""
  },
}); 
