import { Router } from 'express';
import { userRouter } from '@/modules/user/entrypoints/user-http-entrypoint';
import { coinsRouter } from '@/modules/coins/entrypoints/coins-http-entrypoint';

export const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/coins', coinsRouter);
