import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Admin service target: ${config.services.main}`);

export const adminProxy = createProxyMiddleware({
  target: `${config.services.main}${ROUTES.ADMIN.BASE}`,
  changeOrigin: true,
  pathRewrite: { [`^${ROUTES.ADMIN.BASE}`]: '' }
});