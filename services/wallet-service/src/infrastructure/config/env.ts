import 'dotenv-flow/config';


export const config = {
  port: process.env.PORT || '4002',
  rabbitmq_URL: process.env.RABBITMQ_URL || '',
  isProduction: process.env.NODE_ENV === 'production',
};

console.log(config);
