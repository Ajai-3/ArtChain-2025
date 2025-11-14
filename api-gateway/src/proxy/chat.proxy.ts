import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

export const chatProxy = createProxyMiddleware({
  target: `${config.services.chat}/api/v1/chat`,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1/chat": "",
  },
});