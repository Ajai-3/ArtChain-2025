import express from 'express';
import chatRoutes from './presentation/routes/chat.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/chat', chatRoutes);

export default app;