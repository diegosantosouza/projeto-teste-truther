import { CoingeckoPing } from '../../../../src/shared/providers/coingecko/ping';
import { Coingecko } from '../../../../src/shared/providers/coingecko/coingecko-provider';

jest.mock('../../../../src/shared/providers/coingecko/coingecko-provider');

describe('CoingeckoPing', () => {
  const mockCoingecko = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Coingecko.getInstance as jest.Mock).mockReturnValue(mockCoingecko);
  });

  describe('execute', () => {
    it('should return ping response', async () => {
      const mockResponse = {
        json: () => ({ gecko_says: 'V3 (To the moon!)' }),
      };
      mockCoingecko.get.mockResolvedValue(mockResponse);

      const result = await CoingeckoPing.execute();
      expect(result).toEqual({ gecko_says: 'V3 (To the moon!)' });
      expect(mockCoingecko.get).toHaveBeenCalledWith('/ping');
    });

    it('should handle error', async () => {
      const error = new Error('Network error');
      mockCoingecko.get.mockRejectedValue(error);

      await expect(CoingeckoPing.execute()).rejects.toThrow('Network error');
      expect(mockCoingecko.get).toHaveBeenCalledWith('/ping');
    });
  });
}); 