import 'dotenv-flow/config';


export const config = {
  port: process.env.PORT || '4002',
  client_url: process.env.CLIENT_URL || "",
  rabbitmq_URL: process.env.RABBITMQ_URL || '',
  isProduction: process.env.NODE_ENV === 'production',
  stripe_secret_key: process.env.STRIPE_SECRET_KEY || "",
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || ""
};

console.log(config);
