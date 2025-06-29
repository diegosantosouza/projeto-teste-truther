import { Request } from '../../../src/shared/http/request';
import { HttpMethodEnum } from '../../../src/shared/http/http-method-enum';
import axios, { AxiosError } from 'axios';

jest.mock('axios');
jest.mock('axios-retry');

describe('Request', () => {
  let request: Request;
  let mockAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios = axios as jest.Mocked<typeof axios>;
    request = new Request();
  });

  describe('configuration', () => {
    it('should set headers', () => {
      const headers = { 'Authorization': 'Bearer token' };
      request.headers = headers;
      expect(request['_headers']).toEqual(expect.objectContaining(headers));
    });

    it('should set timeout', () => {
      request.timeout = 5000;
      expect(request['_timeout']).toBe(5000);
    });

    it('should set retry', () => {
      request.retry = 3;
      expect(request['_retry']).toBe(3);
    });
  });

  describe('execute', () => {
    it('should execute GET request successfully', async () => {
      const mockResponse = { data: { success: true }, status: 200 };
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue(mockResponse),
      };
      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      const result = await request.execute(HttpMethodEnum.GET, 'https://api.example.com/test');

      expect(mockAxios.create).toHaveBeenCalledWith({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        timeout: 30000,
      });
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('https://api.example.com/test');
      expect(result).toBeDefined();
    });

    it('should execute POST request with data', async () => {
      const mockResponse = { data: { id: 1 }, status: 201 };
      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue(mockResponse),
      };
      mockAxios.create.mockReturnValue(mockAxiosInstance as any);
      const data = { name: 'test' };

      const result = await request.execute(HttpMethodEnum.POST, 'https://api.example.com/test', data);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('https://api.example.com/test', data);
      expect(result).toBeDefined();
    });

    it('should handle axios error with response', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          data: { error: 'Not found' },
          status: 404,
          statusText: 'Not Found',
          headers: {},
          config: { headers: {} },
        },
      };
      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(mockError),
      };
      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      const result = await request.execute(HttpMethodEnum.GET, 'https://api.example.com/test');
      expect(result).toBeDefined();
      expect(result.status()).toBe(404);
      expect(result.json()).toEqual({ error: 'Not found' });
    });

    it('should throw error without response', async () => {
      const mockError = new Error('Network error');
      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(mockError),
      };
      mockAxios.create.mockReturnValue(mockAxiosInstance as any);

      await expect(request.execute(HttpMethodEnum.GET, 'https://api.example.com/test'))
        .rejects.toThrow('Network error');
    });
  });

  describe('isInputMethod', () => {
    it('should return true for input methods', () => {
      expect(Request['isInputMethod'](HttpMethodEnum.POST)).toBe(true);
      expect(Request['isInputMethod'](HttpMethodEnum.PUT)).toBe(true);
      expect(Request['isInputMethod'](HttpMethodEnum.PATCH)).toBe(true);
      expect(Request['isInputMethod'](HttpMethodEnum.DELETE)).toBe(true);
    });

    it('should return false for non-input methods', () => {
      expect(Request['isInputMethod'](HttpMethodEnum.GET)).toBe(false);
    });
  });
}); 