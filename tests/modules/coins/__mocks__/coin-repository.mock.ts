import { Coin } from '@/modules/coins/entities';

export class MockCoinRepository {
  private coins: Coin[] = [];

  async findOne(criteria: any): Promise<Coin | null> {
    return this.coins.find(coin =>
      Object.keys(criteria).every(key => coin[key as keyof Coin] === criteria[key])
    ) || null;
  }

  async find(criteria: any): Promise<Coin[]> {
    return this.coins.filter(coin =>
      Object.keys(criteria).every(key => coin[key as keyof Coin] === criteria[key])
    );
  }

  async upsert(criteria: any, data: Partial<Coin>): Promise<Coin | null> {
    const existingIndex = this.coins.findIndex(coin =>
      Object.keys(criteria).every(key => coin[key as keyof Coin] === criteria[key])
    );

    const coinData: Coin = {
      id: existingIndex >= 0 ? this.coins[existingIndex].id : Date.now().toString(),
      coinId: data.coinId!,
      name: data.name!,
      marketCap: data.marketCap!,
      priceChangePercentage24h: data.priceChangePercentage24h,
      priceChangePercentage7d: data.priceChangePercentage7d,
      lowestPrice: data.lowestPrice,
      highestPrice: data.highestPrice,
      currentPrice: data.currentPrice!,
      createdAt: existingIndex >= 0 ? this.coins[existingIndex].createdAt : new Date(),
      updatedAt: new Date()
    };

    if (existingIndex >= 0) {
      this.coins[existingIndex] = coinData;
    } else {
      this.coins.push(coinData);
    }

    return coinData;
  }

  setMockData(coins: Coin[]): void {
    this.coins = [...coins];
  }

  clearMockData(): void {
    this.coins = [];
  }
} 