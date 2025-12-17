import dotenv from "dotenv";
dotenv.config();
// import { getArtChainSecrets } from "art-chain-shared";

// COMMENTED OUT: AWS Secrets Manager (AWS credentials not working)
// const secrets = await getArtChainSecrets("ArtChainCommonSecret");

// Using hardcoded values from .env file instead
const secrets = {
  aws_cdn_domain: process.env.AWS_CDN_DOMAIN || "your-cdn-domain-here.cloudfront.net",
};

export const config = {
  port: process.env.PORT,
  elastic_url: process.env.ELASTIC_URL,
  aws_cdn_domain: secrets.aws_cdn_domain,
  rabbitmq_url: process.env.RABBITMQ_URL || "",
};
