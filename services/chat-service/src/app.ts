import express from 'express';
import chatRoutes from './presentation/routes/chat.routes';
import { createErrorHandler } from 'art-chain-shared';
import { ROUTES } from './constants/routes';
import { requestLoggerMiddleware } from './presentation/middleware/requestLoggerMiddleware';

const app = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLoggerMiddleware);

app.use(ROUTES.API_V1_CHAT, chatRoutes);

app.use(createErrorHandler)

export default app;