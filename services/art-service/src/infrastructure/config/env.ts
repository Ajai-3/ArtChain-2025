import 'dotenv-flow/config';

export const config = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL!,
    rabbitmq_url: process.env.RABBITMQ_URL!,
    api_gateway_url: process.env.API_GATEWAY_URL!,
    services: {
        user_service_url: process.env.USER_SERVICE_URL!,
    }
}