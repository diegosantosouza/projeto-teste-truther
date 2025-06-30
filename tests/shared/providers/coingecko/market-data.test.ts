import { MarketDataCoingecko } from '../../../../src/shared/providers/coingecko/market-data-coingecko';
import { Coingecko } from '../../../../src/shared/providers/coingecko/coingecko-provider';

jest.mock('../../../../src/shared/providers/coingecko/coingecko-provider');

describe('MarketDataCoingecko', () => {
  const mockCoingecko = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Coingecko.getInstance as jest.Mock).mockReturnValue(mockCoingecko);
  });

  describe('get', () => {
    it('should return market data for valid coin', async () => {
      const mockData = [{
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 50000,
        market_cap: 1000000000,
        price_change_percentage_24h: 4.0,
        price_change_percentage_7d_in_currency: 2.5,
        atl: 67.81,
        ath: 69000,
      }];
      const mockResponse = {
        status: () => 200,
        json: () => mockData,
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const provider = new MarketDataCoingecko();
      const result = await provider.get('bitcoin');

      expect(result).toBeDefined();
      expect(result?.coinId).toBe('bitcoin');
      expect(result?.name).toBe('Bitcoin');
      expect(mockCoingecko.get).toHaveBeenCalledWith('/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=7d');
    });

    it('should return null for non-200 status', async () => {
      const mockResponse = {
        status: () => 404,
        json: () => [],
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const provider = new MarketDataCoingecko();
      const result = await provider.get('invalid-coin');
      expect(result).toBeNull();
    });

    it('should return null for empty data', async () => {
      const mockResponse = {
        status: () => 200,
        json: () => [],
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const provider = new MarketDataCoingecko();
      const result = await provider.get('bitcoin');
      expect(result).toBeNull();
    });

    it('should use custom currency', async () => {
      const mockData = [{ id: 'bitcoin', symbol: 'btc' }];
      const mockResponse = {
        status: () => 200,
        json: () => mockData,
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const provider = new MarketDataCoingecko();
      await provider.get('bitcoin', 'eur');
      expect(mockCoingecko.get).toHaveBeenCalledWith('/coins/markets?vs_currency=eur&ids=bitcoin&price_change_percentage=7d');
    });
  });
}); 