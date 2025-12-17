// import { getArtChainSecrets } from 'art-chain-shared';
import 'dotenv-flow/config';

// COMMENTED OUT: AWS Secrets Manager (AWS credentials not working)
// const secrets = await getArtChainSecrets("ArtChainCommonSecret");

// Using hardcoded values from .env file instead
const secrets = {
    aws_cdn_domain: process.env.AWS_CDN_DOMAIN || "your-cdn-domain-here.cloudfront.net",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your-access-secret-key-here",
};

export const config = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL!,
    rabbitmq_url: process.env.RABBITMQ_URL!,
    cdn_domain: secrets.aws_cdn_domain!,
    api_gateway_url: process.env.API_GATEWAY_URL!,
    redis_url: process.env.REDIS_URL!,
    aws: {
        cloudfront_key_pair_id: process.env.CLOUDFRONT_KEY_PAIR_ID!,
        cloudfront_private_key: process.env.CLOUDFRONT_PRIVATE_KEY!,
    },
    jwt_secret: secrets.jwtAccessSecret!
}