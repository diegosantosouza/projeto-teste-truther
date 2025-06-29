import { CoinRepository } from '@/modules/coins/repositories';
import { CoinListUseCase } from '@/modules/coins/usecases';
import { CoinListHttpController } from '@/modules/coins/controllers';

export const makeCoinListController = (): CoinListHttpController => {
  const coinRepository = new CoinRepository();
  const coinListUseCase = new CoinListUseCase(coinRepository);
  return new CoinListHttpController(coinListUseCase);
};