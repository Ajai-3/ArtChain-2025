import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Elastic search service target: ${config.services.elastic}`);

export const elasticSearchProxy = createProxyMiddleware({
  target: `${config.services.elastic}${ROUTES.ELASTIC.BASE}`,
  changeOrigin: true,
  pathRewrite: { 
    [`^${ROUTES.ELASTIC.BASE}`]: ''
  },
}); 
