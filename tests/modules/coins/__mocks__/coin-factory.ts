import { Coin } from '@/modules/coins/entities';
import { CoinsNameEnum } from '@/modules/coins/entities';

export class CoinFactory {
  static createCoin(overrides: Partial<Coin> = {}): Coin {
    const defaultCoin: Coin = {
      id: '1',
      coinId: CoinsNameEnum.BITCOIN,
      name: 'Bitcoin',
      marketCap: 1000000000,
      priceChangePercentage24h: 4.0,
      priceChangePercentage7d: 2.5,
      lowestPrice: 67.81,
      highestPrice: 69000,
      currentPrice: 50000,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };

    return { ...defaultCoin, ...overrides };
  }

  static createCoinList(count: number = 3): Coin[] {
    const coins: Coin[] = [];
    const coinIds = Object.values(CoinsNameEnum);

    for (let i = 0; i < count; i++) {
      const coinId = coinIds[i % coinIds.length];
      coins.push(this.createCoin({
        id: (i + 1).toString(),
        coinId,
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        currentPrice: 10000 + (i * 1000),
        marketCap: 1000000000 + (i * 100000000)
      }));
    }

    return coins;
  }

  static createBitcoin(): Coin {
    return this.createCoin({
      coinId: CoinsNameEnum.BITCOIN,
      name: 'Bitcoin',
      currentPrice: 50000
    });
  }

  static createEthereum(): Coin {
    return this.createCoin({
      coinId: CoinsNameEnum.ETHEREUM,
      name: 'Ethereum',
      currentPrice: 3000
    });
  }
} 