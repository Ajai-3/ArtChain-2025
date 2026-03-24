import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`User service target: ${config.services.main}`);

export const userProxy = createProxyMiddleware({
  target: `${config.services.main}${ROUTES.USER.BASE}`,
  changeOrigin: true,
  pathRewrite: {
    [`^${ROUTES.USER.BASE}`]: '',
  },
});