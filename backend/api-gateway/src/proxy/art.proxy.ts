import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Art service target: ${config.services.art}`);

export const artProxy = createProxyMiddleware({
  target: `${config.services.art}${ROUTES.ART.BASE}`,
  changeOrigin: true,
  pathRewrite: { 
    [`^${ROUTES.ART.BASE}`]: ''
  },
}); 
