import { Coingecko } from '../../../../src/shared/providers/coingecko/coingecko-provider';
import { Http } from '../../../../src/shared/http';

jest.mock('../../../../src/shared/config/env', () => ({
  env: {
    coingecko_base_url: 'https://api.coingecko.com/api/v3',
    coingecko_api_key: 'test-api-key',
    node_env: 'development',
  },
}));

jest.mock('../../../../src/shared/http');

describe('Coingecko Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Coingecko as any).instance = null;
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = Coingecko.getInstance();
      const instance2 = Coingecko.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getAuthMap', () => {
    it('should return development auth headers', () => {
      const auth = (Coingecko as any).getAuthMap('development');
      expect(auth).toEqual({ 'x-cg-api-key': 'test-api-key' });
    });

    it('should return production auth headers', () => {
      const auth = (Coingecko as any).getAuthMap('production');
      expect(auth).toEqual({ 'x-cg-pro-api-key': 'test-api-key' });
    });

    it('should throw error for invalid environment', () => {
      expect(() => (Coingecko as any).getAuthMap('invalid')).toThrow('Invalid coingecko environment');
    });
  });

  describe('make', () => {
    it('should create Http instance with correct configuration', () => {
      const mockHttp = { url: '', withHeaders: jest.fn() };
      (Http as jest.Mock).mockImplementation(() => mockHttp);
      (Coingecko as any).make();
      expect(Http).toHaveBeenCalled();
      expect(mockHttp.url).toBe('https://api.coingecko.com/api/v3');
      expect(mockHttp.withHeaders).toHaveBeenCalledWith({ 'x-cg-api-key': 'test-api-key' });
    });
  });
}); 