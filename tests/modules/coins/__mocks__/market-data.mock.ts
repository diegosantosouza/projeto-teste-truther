import { CoinMarketData } from '@/shared/providers/coingecko/interface';
import { CoinsNameEnum } from '@/modules/coins/entities';

export class MockMarketData {
  private static mockData: Record<string, CoinMarketData | null> = {};

  static async get(coinId: string): Promise<CoinMarketData | null> {
    return this.mockData[coinId] || null;
  }

  static setMockData(coinId: string, data: CoinMarketData | null): void {
    this.mockData[coinId] = data;
  }

  static clearMockData(): void {
    this.mockData = {};
  }

  static createMockCoinMarketData(coinId: CoinsNameEnum): CoinMarketData {
    return {
      id: coinId,
      symbol: coinId.toUpperCase(),
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      image: `https://example.com/${coinId}.png`,
      current_price: 50000,
      market_cap: 1000000000,
      market_cap_rank: 1,
      fully_diluted_valuation: 1100000000,
      total_volume: 50000000,
      high_24h: 52000,
      low_24h: 48000,
      price_change_24h: 2000,
      price_change_percentage_24h: 4.0,
      market_cap_change_24h: 40000000,
      market_cap_change_percentage_24h: 4.0,
      circulating_supply: 20000000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 69000,
      ath_change_percentage: -27.5,
      ath_date: new Date('2021-11-10'),
      atl: 67.81,
      atl_change_percentage: 73680.5,
      atl_date: new Date('2013-07-06'),
      roi: null,
      last_updated: new Date(),
      price_change_percentage_7d_in_currency: 2.5
    };
  }
} 