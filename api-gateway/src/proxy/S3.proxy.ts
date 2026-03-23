import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Upload service target: ${config.services.s3}`);

export const s3Proxy = createProxyMiddleware({
  target: `${config.services.s3}${ROUTES.UPLOAD.BASE}`,
  changeOrigin: true,
  pathRewrite: { 
    [`^${ROUTES.UPLOAD.BASE}`]: ''
  },
}); 
