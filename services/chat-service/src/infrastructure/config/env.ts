import dotenv from "dotenv";
import { getArtChainSecrets } from "art-chain-shared";
dotenv.config();

const secrets = await getArtChainSecrets("ArtChainCommonSecret");

export const env = {
  port: process.env.PORT || 4007,
  mongo_uri: process.env.MONGO_URI || "",
  redis_url: process.env.REDIS_URL || "",
  frontend_url: process.env.FRONTEND_URL || "",
  jwt: {
    accessSecret: secrets.jwtAccessSecret,
  },
};
