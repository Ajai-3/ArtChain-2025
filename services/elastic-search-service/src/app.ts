import express from 'express';
import elasticUserRoutes from './routes/userElastic.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();
app.use(express.json());

app.use('/api/v1/elastic-user', elasticUserRoutes);

app.use(errorHandler)

export default app;
