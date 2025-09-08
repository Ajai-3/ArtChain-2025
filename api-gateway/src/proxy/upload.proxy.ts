import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

console.log("Upload service target:", config.services.upload)

export const uploadProxy = createProxyMiddleware({
  target: `${config.services.upload}/api/v1/upload`,
  changeOrigin: true,
  pathRewrite: { 
    "^/api/v1/upload": ""
  },
}); 
