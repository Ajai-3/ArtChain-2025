import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Notification service target: ${config.services.notifications}`);

export const notificationsProxy = createProxyMiddleware({
  target: `${config.services.notifications}${ROUTES.NOTIFICATIONS.BASE}`,
  changeOrigin: true,
  pathRewrite: { 
    [`^${ROUTES.NOTIFICATIONS.BASE}`]: ''
  },
}); 
