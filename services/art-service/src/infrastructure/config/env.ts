import 'dotenv-flow/config';

export const config = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL!,
    services: {
        user_service_url: process.env.USER_SERVICE_URL!,
    }
}