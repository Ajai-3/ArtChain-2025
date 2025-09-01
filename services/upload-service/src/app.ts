import express from 'express';

const app = express();

import uploadRoutes from './presentation/routes/upload.routes';
import { errorHandler } from './presentation/middleware/errorHandler';

app.use(express.json());

app.use('/upload', uploadRoutes);

app.use(errorHandler);

export default app;