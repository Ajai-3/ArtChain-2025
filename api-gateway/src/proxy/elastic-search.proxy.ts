import { config } from "../config/env";
import { createProxyMiddleware } from "http-proxy-middleware";

console.log("Elastic search service target:", config.services.elastic)

export const elasticSearchProxy = createProxyMiddleware({
  target: `${config.services.elastic}/api/v1/elastic-user`,
  changeOrigin: true,
  pathRewrite: { 
    "^/api/v1/elastic-user": ""
  },
}); 
