import { CoinShowHttpController } from '@/modules/coins/controllers';
import { CoinRepository } from '@/modules/coins/repositories';
import { CoinShowUseCase } from '@/modules/coins/usecases';
import { MarketDataCoingecko } from '@/shared/providers/coingecko/market-data-coingecko';

export const makeCoinShowController = (): CoinShowHttpController => {
  const coinRepository = new CoinRepository();
  const marketDataProvider = new MarketDataCoingecko();
  const coinShowUseCase = new CoinShowUseCase(coinRepository, marketDataProvider);
  return new CoinShowHttpController(coinShowUseCase);
};