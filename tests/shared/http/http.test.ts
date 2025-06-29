import { Http } from '../../../src/shared/http/http';
import { Request } from '../../../src/shared/http/request';
import { ResponseInterface } from '../../../src/shared/http/response-interface';
import { AxiosError } from 'axios';

jest.mock('../../../src/shared/http/request');

describe('Http', () => {
  let http: Http;
  let mockRequest: jest.Mocked<Request>;

  const createMockResponse = (status: number, data: any = {}): ResponseInterface => ({
    status: () => status,
    json: () => data,
    body: () => JSON.stringify(data),
    ok: () => status >= 200 && status < 300,
    successful: () => status >= 200 && status < 300,
    failed: () => status < 200 || status >= 300,
    serverError: () => status >= 500 && status < 600,
    clientError: () => status >= 400 && status < 500,
    header: () => '',
    headers: () => ({}),
    throw: function () { return this; },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: {},
      timeout: 30000,
      retry: 0,
      execute: jest.fn(),
    } as any;
    (Request as unknown as jest.Mock).mockImplementation(() => mockRequest);
    http = new Http();
  });

  describe('configuration', () => {
    it('should set url', () => {
      http.url = 'https://api.example.com';
      expect(http.url).toBe('https://api.example.com');
    });

    it('should set headers', () => {
      const headers = { 'Content-Type': 'application/json' };
      const result = http.withHeaders(headers);
      expect(result).toBe(http);
    });

    it('should set token', () => {
      const result = http.withToken('test-token');
      expect(result).toBe(http);
    });

    it('should set bearer token', () => {
      const result = http.withBearerToken('test-bearer');
      expect(result).toBe(http);
    });

    it('should set basic auth', () => {
      const result = http.withBasicAuth('test-basic');
      expect(result).toBe(http);
    });

    it('should set params', () => {
      const result = http.param({ key: 'value' });
      expect(result).toBe(http);
    });

    it('should set timeout', () => {
      const result = http.timeout(5000);
      expect(result).toBe(http);
    });

    it('should set retry', () => {
      const result = http.retry(3);
      expect(result).toBe(http);
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      http.url = 'https://api.example.com';
    });

    it('should execute GET request', async () => {
      const mockResponse = createMockResponse(200, { data: 'test' });
      mockRequest.execute.mockResolvedValue(mockResponse);

      const result = await http.get('/test');
      expect(mockRequest.execute).toHaveBeenCalledWith('get', 'https://api.example.com/test');
      expect(result).toBe(mockResponse);
    });

    it('should execute POST request', async () => {
      const mockResponse = createMockResponse(201, { id: 1 });
      mockRequest.execute.mockResolvedValue(mockResponse);
      const data = { name: 'test' };

      const result = await http.post('/test', data);
      expect(mockRequest.execute).toHaveBeenCalledWith('post', 'https://api.example.com/test', data);
      expect(result).toBe(mockResponse);
    });

    it('should execute PUT request', async () => {
      const mockResponse = createMockResponse(200, { updated: true });
      mockRequest.execute.mockResolvedValue(mockResponse);
      const data = { name: 'updated' };

      const result = await http.put('/test', data);
      expect(mockRequest.execute).toHaveBeenCalledWith('put', 'https://api.example.com/test', data);
      expect(result).toBe(mockResponse);
    });

    it('should execute PATCH request', async () => {
      const mockResponse = createMockResponse(200, { patched: true });
      mockRequest.execute.mockResolvedValue(mockResponse);
      const data = { name: 'patched' };

      const result = await http.patch('/test', data);
      expect(mockRequest.execute).toHaveBeenCalledWith('patch', 'https://api.example.com/test', data);
      expect(result).toBe(mockResponse);
    });

    it('should execute DELETE request', async () => {
      const mockResponse = createMockResponse(204);
      mockRequest.execute.mockResolvedValue(mockResponse);

      const result = await http.delete('/test');
      expect(mockRequest.execute).toHaveBeenCalledWith('delete', 'https://api.example.com/test');
      expect(result).toBe(mockResponse);
    });

    it('should handle axios error with response', async () => {
      const mockError = new AxiosError('Axios error', undefined, undefined, undefined, {
        data: { error: 'Not found' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { headers: {} } as any,
      });
      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(mockError),
      };
      mockRequest.execute.mockReturnValue(mockAxiosInstance as any);

      const result = await http.get('/test');

      expect(result).toBeDefined();
    });
  });

  describe('URL building with params', () => {
    beforeEach(() => {
      http.url = 'https://api.example.com';
    });

    it('should build URL with query parameters', async () => {
      const mockResponse = createMockResponse(200, {});
      mockRequest.execute.mockResolvedValue(mockResponse);

      http.param({ key1: 'value1' }).param({ key2: 'value2' });
      await http.get('/test');

      expect(mockRequest.execute).toHaveBeenCalledWith('get', 'https://api.example.com/test?key1=value1&key2=value2');
    });

    it('should build URL without params when none provided', async () => {
      const mockResponse = createMockResponse(200, {});
      mockRequest.execute.mockResolvedValue(mockResponse);

      await http.get('/test');

      expect(mockRequest.execute).toHaveBeenCalledWith('get', 'https://api.example.com/test');
    });
  });
}); 