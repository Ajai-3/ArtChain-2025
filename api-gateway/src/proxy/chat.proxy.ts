import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Chat service target: ${config.services.chat}`);

export const chatProxy = createProxyMiddleware({
  target: `${config.services.chat}${ROUTES.CHAT.BASE}`,
  changeOrigin: true,
  pathRewrite: {
    [`^${ROUTES.CHAT.BASE}`]: '',
  },
});