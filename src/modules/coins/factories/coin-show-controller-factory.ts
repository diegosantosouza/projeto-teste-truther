import { CoinShowHttpController } from '@/modules/coins/controllers';
import { CoinRepository } from '@/modules/coins/repositories';
import { CoinShowUseCase } from '@/modules/coins/usecases';

export const makeCoinShowController = (): CoinShowHttpController => {
  const coinRepository = new CoinRepository();
  const coinShowUseCase = new CoinShowUseCase(coinRepository);
  return new CoinShowHttpController(coinShowUseCase);
};