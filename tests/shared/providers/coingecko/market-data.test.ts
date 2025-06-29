import { MarketData } from '../../../../src/shared/providers/coingecko/market-data';
import { Coingecko } from '../../../../src/shared/providers/coingecko/coingecko-provider';

jest.mock('../../../../src/shared/providers/coingecko/coingecko-provider');

describe('MarketData', () => {
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
      }];
      const mockResponse = {
        status: () => 200,
        json: () => mockData,
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const result = await MarketData.get('bitcoin');
      expect(result).toEqual(mockData[0]);
      expect(mockCoingecko.get).toHaveBeenCalledWith('/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=7d');
    });

    it('should return null for non-200 status', async () => {
      const mockResponse = {
        status: () => 404,
        json: () => [],
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const result = await MarketData.get('invalid-coin');
      expect(result).toBeNull();
    });

    it('should return null for empty data', async () => {
      const mockResponse = {
        status: () => 200,
        json: () => [],
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const result = await MarketData.get('bitcoin');
      expect(result).toBeNull();
    });

    it('should use custom currency', async () => {
      const mockData = [{ id: 'bitcoin', symbol: 'btc' }];
      const mockResponse = {
        status: () => 200,
        json: () => mockData,
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      await MarketData.get('bitcoin', 'eur');
      expect(mockCoingecko.get).toHaveBeenCalledWith('/coins/markets?vs_currency=eur&ids=bitcoin&price_change_percentage=7d');
    });
  });
}); 