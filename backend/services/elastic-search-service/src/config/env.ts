import dotenv from 'dotenv';
dotenv.config();

const secrets = {
  aws_cdn_domain:
    process.env.AWS_CDN_DOMAIN || 'your-cdn-domain-here.cloudfront.net',
};

export const config = {
  port: process.env.PORT,
  elastic_url: process.env.ELASTIC_URL,
  aws_cdn_domain: secrets.aws_cdn_domain,
  rabbitmq_url: process.env.RABBITMQ_URL || '',
  loki: {
    host: process.env.LOKI_HOST!,
    user: process.env.LOKI_USER,
    token: process.env.LOKI_TOKEN,
  },
};
