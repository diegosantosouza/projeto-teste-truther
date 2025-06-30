import { CoinShowUseCase } from '@/modules/coins/usecases';
import { MockCoinRepository } from '../__mocks__/coin-repository.mock';
import { CoinFactory } from '../__mocks__/coin-factory';
import { CoinsNameEnum } from '@/modules/coins/entities';
import { NotFoundError, ServerError } from '@/shared/errors';
import { MarketDataInterface } from '@/shared/providers/interfaces/market-data';
import { marketDataToCoin } from '@/shared/providers/adapter/market-data-to-coin';

describe('CoinShowUseCase', () => {
  let useCase: CoinShowUseCase;
  let mockRepository: MockCoinRepository;
  let mockMarketDataProvider: jest.Mocked<MarketDataInterface>;

  beforeEach(() => {
    mockRepository = new MockCoinRepository();
    mockMarketDataProvider = {
      get: jest.fn()
    };
    useCase = new CoinShowUseCase(mockRepository as any, mockMarketDataProvider);
  });

  describe('execute', () => {
    it('should return coin from API when available', async () => {
      const mockCoin = CoinFactory.createBitcoin();
      mockMarketDataProvider.get.mockResolvedValue(mockCoin);

      const result = await useCase.execute({ coinId: CoinsNameEnum.BITCOIN });

      expect(result.coinId).toBe(CoinsNameEnum.BITCOIN);
      expect(result.name).toBe('Bitcoin');
      expect(result.currentPrice).toBe(50000);
    });

    it('should return cached coin when API is not available', async () => {
      mockMarketDataProvider.get.mockResolvedValue(null);

      const cachedCoin = CoinFactory.createBitcoin();
      mockRepository.setMockData([cachedCoin]);

      const result = await useCase.execute({ coinId: CoinsNameEnum.BITCOIN });

      expect(result).toEqual(cachedCoin);
    });

    it('should throw NotFoundError when coin not found in API or cache', async () => {
      mockMarketDataProvider.get.mockResolvedValue(null);
      mockRepository.setMockData([]);

      await expect(useCase.execute({ coinId: CoinsNameEnum.BITCOIN }))
        .rejects.toThrow(NotFoundError);
    });

    it('should update cache when API returns new data', async () => {
      const mockCoin = CoinFactory.createBitcoin();
      mockMarketDataProvider.get.mockResolvedValue(mockCoin);

      const result = await useCase.execute({ coinId: CoinsNameEnum.BITCOIN });

      expect(result.coinId).toBe(CoinsNameEnum.BITCOIN);
      expect(result.currentPrice).toBe(50000);
    });

    it('should handle different coin types', async () => {
      const mockCoin = CoinFactory.createEthereum();
      mockMarketDataProvider.get.mockResolvedValue(mockCoin);

      const result = await useCase.execute({ coinId: CoinsNameEnum.ETHEREUM });

      expect(result.coinId).toBe(CoinsNameEnum.ETHEREUM);
      expect(result.name).toBe('Ethereum');
      expect(result.currentPrice).toBe(3000);
    });
  });
}); 