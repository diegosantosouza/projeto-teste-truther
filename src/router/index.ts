import { Router } from 'express';
import { userRouter } from '@/modules/user/entrypoints/user-http-entrypoint';
import { coinsRouter } from '@/modules/coins/entrypoints/coins-http-entrypoint';

export const mainRouter = Router();

mainRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

mainRouter.use('/user', userRouter);
mainRouter.use('/coins', coinsRouter);
