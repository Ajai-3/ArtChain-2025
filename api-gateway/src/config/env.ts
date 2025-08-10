import dotenv from 'dotenv';
dotenv.config();
import { getArtChainSecrets } from 'art-chain-shared';

export const config = {
  port: process.env.PORT || 3000,
  frontend_url: process.env.FRONTEND_URL,
  services: {
    main: process.env.MAIN_SERVICE_URL,
    art: process.env.ART_SERVICE_URL
  }
};