import { CoinRepository } from '@/modules/coins/repositories';
import { NotFoundError, ServerError } from '@/shared/errors';
import { CoinShowInput, CoinShowOutput } from '@/modules/coins/dto';
import { MarketData } from '@/shared/providers/coingecko';
import { marketDataToCoin } from '@/modules/coins/adapter';

export class CoinShowUseCase {
  constructor(private readonly coinRepository: CoinRepository) { }

  async execute(input: CoinShowUseCase.Input): Promise<CoinShowUseCase.Output> {
    const marketData = await MarketData.get(input.coinId);
    if (!marketData) {
      const coinCachedInDb = await this.coinRepository.findOne({ coinId: input.coinId });
      if (!coinCachedInDb) {
        throw new NotFoundError('Coin not found');
      }
      return coinCachedInDb;
    }
    const coin = marketDataToCoin(marketData);
    const coinRefreshed = await this.coinRepository.upsert({ coinId: input.coinId }, coin);
    if (!coinRefreshed) {
      throw new ServerError('Error upserting coin');
    }
    return coinRefreshed;
  }
}

export namespace CoinShowUseCase {
  export type Input = CoinShowInput;

  export type Output = CoinShowOutput;
}
