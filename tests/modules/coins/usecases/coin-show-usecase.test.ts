jest.mock('@/shared/providers/coingecko', () => ({
  MarketData: {
    get: jest.fn()
  }
}));

import { CoinShowUseCase } from '@/modules/coins/usecases';
import { MockCoinRepository } from '../__mocks__/coin-repository.mock';
import { MockMarketData } from '../__mocks__/market-data.mock';
import { CoinFactory } from '../__mocks__/coin-factory';
import { CoinsNameEnum } from '@/modules/coins/entities';
import { NotFoundError, ServerError } from '@/shared/errors';
import { MarketData } from '@/shared/providers/coingecko';

describe('CoinShowUseCase', () => {
  let useCase: CoinShowUseCase;
  let mockRepository: MockCoinRepository;
  const mockMarketDataGet = MarketData.get as jest.MockedFunction<typeof MarketData.get>;

  beforeEach(() => {
    mockRepository = new MockCoinRepository();
    useCase = new CoinShowUseCase(mockRepository as any);
    MockMarketData.clearMockData();
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return coin from API when available', async () => {
      const mockMarketData = MockMarketData.createMockCoinMarketData(CoinsNameEnum.BITCOIN);
      mockMarketDataGet.mockResolvedValue(mockMarketData);

      const result = await useCase.execute({ coinId: CoinsNameEnum.BITCOIN });

      expect(result.coinId).toBe(CoinsNameEnum.BITCOIN);
      expect(result.name).toBe('Bitcoin');
      expect(result.currentPrice).toBe(50000);
    });

    it('should return cached coin when API is not available', async () => {
      mockMarketDataGet.mockResolvedValue(null);

      const cachedCoin = CoinFactory.createBitcoin();
      mockRepository.setMockData([cachedCoin]);

      const result = await useCase.execute({ coinId: CoinsNameEnum.BITCOIN });

      expect(result).toEqual(cachedCoin);
    });

    it('should throw NotFoundError when coin not found in API or cache', async () => {
      mockMarketDataGet.mockResolvedValue(null);
      mockRepository.setMockData([]);

      await expect(useCase.execute({ coinId: CoinsNameEnum.BITCOIN }))
        .rejects.toThrow(NotFoundError);
    });

    it('should update cache when API returns new data', async () => {
      const mockMarketData = MockMarketData.createMockCoinMarketData(CoinsNameEnum.BITCOIN);
      mockMarketDataGet.mockResolvedValue(mockMarketData);

      const result = await useCase.execute({ coinId: CoinsNameEnum.BITCOIN });

      expect(result.coinId).toBe(CoinsNameEnum.BITCOIN);
      expect(result.currentPrice).toBe(50000);
    });

    it('should handle different coin types', async () => {
      const mockMarketData = MockMarketData.createMockCoinMarketData(CoinsNameEnum.ETHEREUM);
      mockMarketData.name = 'Ethereum';
      mockMarketData.current_price = 3000;
      mockMarketDataGet.mockResolvedValue(mockMarketData);

      const result = await useCase.execute({ coinId: CoinsNameEnum.ETHEREUM });

      expect(result.coinId).toBe(CoinsNameEnum.ETHEREUM);
      expect(result.name).toBe('Ethereum');
      expect(result.currentPrice).toBe(3000);
    });
  });
}); 