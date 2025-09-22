import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

console.log("Wallet service target:", config.services.wallet)

export const walletProxy = createProxyMiddleware({
  target: `${config.services.wallet}/api/v1/wallet`,
  changeOrigin: true,
  pathRewrite: { 
    "^/api/v1/wallet": ""
  },
}); 
