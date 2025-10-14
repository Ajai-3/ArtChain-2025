import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

console.log("Upload service target:", config.services.S3)

export const s3Proxy = createProxyMiddleware({
  target: `${config.services.S3}/api/v1/upload`,
  changeOrigin: true,
  pathRewrite: { 
    "^/api/v1/upload": ""
  },
}); 
