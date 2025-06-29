import { CoinShowHttpController } from '@/modules/coins/controllers';
import { CoinShowUseCase } from '@/modules/coins/usecases';
import { CoinFactory } from '../__mocks__/coin-factory';
import { CoinsNameEnum } from '@/modules/coins/entities';
import { Request } from 'express';

describe('CoinShowHttpController', () => {
  let controller: CoinShowHttpController;
  let mockUseCase: jest.Mocked<CoinShowUseCase>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new CoinShowHttpController(mockUseCase);
  });

  describe('handle', () => {
    it('should return coin data when valid coinId is provided', async () => {
      const mockCoin = CoinFactory.createBitcoin();
      mockUseCase.execute.mockResolvedValue(mockCoin);

      const mockRequest = {
        params: { coinId: CoinsNameEnum.BITCOIN }
      } as unknown as Request;

      const result = await controller.handle(mockRequest);

      expect(mockUseCase.execute).toHaveBeenCalledWith({ coinId: CoinsNameEnum.BITCOIN });
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockCoin);
    });

    it('should handle different coin types', async () => {
      const mockCoin = CoinFactory.createEthereum();
      mockUseCase.execute.mockResolvedValue(mockCoin);

      const mockRequest = {
        params: { coinId: CoinsNameEnum.ETHEREUM }
      } as unknown as Request;

      const result = await controller.handle(mockRequest);

      expect(mockUseCase.execute).toHaveBeenCalledWith({ coinId: CoinsNameEnum.ETHEREUM });
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockCoin);
    });

    it('should validate coinId parameter', async () => {
      const mockRequest = {
        params: { coinId: 'invalid-coin' }
      } as unknown as Request;

      await expect(controller.handle(mockRequest)).rejects.toThrow();
    });

    it('should propagate use case errors', async () => {
      const error = new Error('Use case error');
      mockUseCase.execute.mockRejectedValue(error);

      const mockRequest = {
        params: { coinId: CoinsNameEnum.BITCOIN }
      } as unknown as Request;

      await expect(controller.handle(mockRequest)).rejects.toThrow('Use case error');
    });
  });
}); 