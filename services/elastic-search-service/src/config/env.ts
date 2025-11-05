import dotenv from "dotenv";
dotenv.config();
import { getArtChainSecrets } from "art-chain-shared";

const secrets = await getArtChainSecrets("ArtChainCommonSecret");

export const config = {
  port: process.env.PORT,
  elastic_url: process.env.ELASTIC_URL,
  aws_cdn_domain: secrets.aws_cdn_domain,
  rabbitmq_url: process.env.RABBITMQ_URL || "",
};
