import { CoinListUseCase } from '@/modules/coins/usecases';
import { MockCoinRepository } from '../__mocks__/coin-repository.mock';
import { CoinFactory } from '../__mocks__/coin-factory';

describe('CoinListUseCase', () => {
  let useCase: CoinListUseCase;
  let mockRepository: MockCoinRepository;

  beforeEach(() => {
    mockRepository = new MockCoinRepository();
    useCase = new CoinListUseCase(mockRepository as any);
  });

  describe('execute', () => {
    it('should return empty array when no coins exist', async () => {
      mockRepository.setMockData([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
    });

    it('should return all coins from repository', async () => {
      const mockCoins = CoinFactory.createCoinList(3);
      mockRepository.setMockData(mockCoins);

      const result = await useCase.execute();

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockCoins);
    });

    it('should return single coin', async () => {
      const mockCoin = CoinFactory.createBitcoin();
      mockRepository.setMockData([mockCoin]);

      const result = await useCase.execute();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockCoin);
    });

    it('should return multiple coins with different types', async () => {
      const bitcoin = CoinFactory.createBitcoin();
      const ethereum = CoinFactory.createEthereum();
      mockRepository.setMockData([bitcoin, ethereum]);

      const result = await useCase.execute();

      expect(result).toHaveLength(2);
      expect(result[0].coinId).toBe('bitcoin');
      expect(result[1].coinId).toBe('ethereum');
    });
  });
}); 