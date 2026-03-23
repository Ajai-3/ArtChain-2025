import { config } from '../config/env';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../constants/routes';
import { logger } from '../utils/logger';

logger.info(`Wallet service target: ${config.services.wallet}`);

export const walletProxy = createProxyMiddleware({
  target: `${config.services.wallet}${ROUTES.WALLET.BASE}`,
  changeOrigin: true,
  pathRewrite: { 
    [`^${ROUTES.WALLET.BASE}`]: ''
  },
}); 
