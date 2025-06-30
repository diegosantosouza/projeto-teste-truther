import { marketDataToCoin } from '@/shared/providers/adapter/market-data-to-coin';
import { MockMarketData } from '../__mocks__/market-data.mock';
import { CoinsNameEnum } from '@/modules/coins/entities';

describe('marketDataToCoin', () => {
  beforeEach(() => {
    MockMarketData.clearMockData();
  });

  it('should convert CoinMarketData to Coin format', () => {
    const mockMarketData = MockMarketData.createMockCoinMarketData(CoinsNameEnum.BITCOIN);

    const result = marketDataToCoin(mockMarketData);

    expect(result.coinId).toBe(CoinsNameEnum.BITCOIN);
    expect(result.name).toBe('Bitcoin');
    expect(result.marketCap).toBe(1000000000);
    expect(result.currentPrice).toBe(50000);
    expect(result.priceChangePercentage24h).toBe(4.0);
    expect(result.priceChangePercentage7d).toBe(2.5);
    expect(result.lowestPrice).toBe(67.81);
    expect(result.highestPrice).toBe(69000);
  });

  it('should handle different coin types', () => {
    const mockMarketData = MockMarketData.createMockCoinMarketData(CoinsNameEnum.ETHEREUM);
    mockMarketData.name = 'Ethereum';
    mockMarketData.current_price = 3000;

    const result = marketDataToCoin(mockMarketData);

    expect(result.coinId).toBe(CoinsNameEnum.ETHEREUM);
    expect(result.name).toBe('Ethereum');
    expect(result.currentPrice).toBe(3000);
  });

  it('should map all required fields correctly', () => {
    const mockMarketData = MockMarketData.createMockCoinMarketData(CoinsNameEnum.BITCOIN);

    const result = marketDataToCoin(mockMarketData);

    expect(result.coinId).toBe(mockMarketData.id as CoinsNameEnum);
    expect(result.name).toBe(mockMarketData.name);
    expect(result.marketCap).toBe(mockMarketData.market_cap);
    expect(result.currentPrice).toBe(mockMarketData.current_price);
    expect(result.priceChangePercentage24h).toBe(mockMarketData.price_change_percentage_24h);
    expect(result.priceChangePercentage7d).toBe(mockMarketData.price_change_percentage_7d_in_currency);
    expect(result.lowestPrice).toBe(mockMarketData.atl);
    expect(result.highestPrice).toBe(mockMarketData.ath);
  });
}); 