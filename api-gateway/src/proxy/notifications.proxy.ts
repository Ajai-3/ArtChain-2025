import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

console.log("Notification service target:", config.services.notifications)

export const notificationsProxy = createProxyMiddleware({
  target: `${config.services.notifications}/api/v1/notifications`,
  changeOrigin: true,
  pathRewrite: { 
    "^/api/v1/notifications": ""
  },
}); 
