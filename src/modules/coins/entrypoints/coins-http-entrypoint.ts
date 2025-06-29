import { Router } from 'express';
import { adaptRoute } from '@/shared/adapters';
import { makeCoinListController, makeCoinShowController } from '@/modules/coins/factories';

export const coinsRouter = Router();

coinsRouter.get('/:coinId', adaptRoute(makeCoinShowController()));
coinsRouter.get('/', adaptRoute(makeCoinListController()));
