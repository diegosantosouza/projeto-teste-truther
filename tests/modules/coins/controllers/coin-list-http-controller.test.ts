import { CoinListHttpController } from '@/modules/coins/controllers';
import { CoinListUseCase } from '@/modules/coins/usecases';
import { CoinFactory } from '../__mocks__/coin-factory';
import { Request } from 'express';

describe('CoinListHttpController', () => {
  let controller: CoinListHttpController;
  let mockUseCase: jest.Mocked<CoinListUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new CoinListHttpController(mockUseCase);
  });

  describe('handle', () => {
    it('should return empty array when no coins exist', async () => {
      mockUseCase.execute.mockResolvedValue([]);

      const mockRequest = {} as unknown as Request;

      const result = await controller.handle(mockRequest);

      expect(mockUseCase.execute).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual([]);
    });

    it('should return all coins from use case', async () => {
      const mockCoins = CoinFactory.createCoinList(3);
      mockUseCase.execute.mockResolvedValue(mockCoins);

      const mockRequest = {} as unknown as Request;

      const result = await controller.handle(mockRequest);

      expect(mockUseCase.execute).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockCoins);
    });

    it('should return single coin', async () => {
      const mockCoin = CoinFactory.createBitcoin();
      mockUseCase.execute.mockResolvedValue([mockCoin]);

      const mockRequest = {} as unknown as Request;

      const result = await controller.handle(mockRequest);

      expect(mockUseCase.execute).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.body).toHaveLength(1);
      expect(result.body[0]).toEqual(mockCoin);
    });

    it('should propagate use case errors', async () => {
      const error = new Error('Use case error');
      mockUseCase.execute.mockRejectedValue(error);

      const mockRequest = {} as unknown as Request;

      await expect(controller.handle(mockRequest)).rejects.toThrow('Use case error');
    });
  });
}); 