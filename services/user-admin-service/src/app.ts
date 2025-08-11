import express from 'express';
import cookieParser from 'cookie-parser';
import { createErrorHandler } from 'art-chain-shared';

import authRouter from './presentation/routes/user/auth.routes';
import userRouter from './presentation/routes/user/user.routes';
import adminRouter from './presentation/routes/admin/admin.routes';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});

app.get('/api/v1/user/health', (req, res) => {
    return res.send('hello');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

app.use(createErrorHandler(false));

export default app;