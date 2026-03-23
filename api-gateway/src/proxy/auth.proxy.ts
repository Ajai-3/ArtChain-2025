import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Auth service target: ${config.services.main}`);

export const authProxy = createProxyMiddleware({
  target: `${config.services.main}${ROUTES.AUTH.BASE}`,
  changeOrigin: true,
  pathRewrite: { 
    [`^${ROUTES.AUTH.BASE}`]: ''
  },
}); 
