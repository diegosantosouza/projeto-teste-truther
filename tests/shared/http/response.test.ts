import { Response } from '../../../src/shared/http/response';
import { RequestException } from '../../../src/shared/http/request-exception';
import { AxiosResponse } from 'axios';

describe('Response', () => {
  const createMockAxiosResponse = (status: number, data: any = {}, headers: any = {}): AxiosResponse => ({
    data,
    status,
    statusText: 'OK',
    headers,
    config: {} as any,
  });

  describe('status methods', () => {
    it('should return correct status code', () => {
      const mockAxiosResponse = createMockAxiosResponse(200);
      const response = new Response(mockAxiosResponse);
      expect(response.status()).toBe(200);
    });

    it('should return true for successful status (200-299)', () => {
      const response200 = new Response(createMockAxiosResponse(200));
      const response201 = new Response(createMockAxiosResponse(201));
      const response299 = new Response(createMockAxiosResponse(299));

      expect(response200.ok()).toBe(true);
      expect(response201.ok()).toBe(true);
      expect(response299.ok()).toBe(true);
    });

    it('should return false for unsuccessful status', () => {
      const response400 = new Response(createMockAxiosResponse(400));
      const response500 = new Response(createMockAxiosResponse(500));

      expect(response400.ok()).toBe(false);
      expect(response500.ok()).toBe(false);
    });

    it('should return true for successful responses', () => {
      const response = new Response(createMockAxiosResponse(200));
      expect(response.successful()).toBe(true);
    });

    it('should return true for failed responses', () => {
      const response = new Response(createMockAxiosResponse(404));
      expect(response.failed()).toBe(true);
    });

    it('should return true for server errors (500-599)', () => {
      const response500 = new Response(createMockAxiosResponse(500));
      const response599 = new Response(createMockAxiosResponse(599));

      expect(response500.serverError()).toBe(true);
      expect(response599.serverError()).toBe(true);
    });

    it('should return false for non-server errors', () => {
      const response400 = new Response(createMockAxiosResponse(400));
      const response200 = new Response(createMockAxiosResponse(200));

      expect(response400.serverError()).toBe(false);
      expect(response200.serverError()).toBe(false);
    });

    it('should return true for client errors (400-499)', () => {
      const response400 = new Response(createMockAxiosResponse(400));
      const response499 = new Response(createMockAxiosResponse(499));

      expect(response400.clientError()).toBe(true);
      expect(response499.clientError()).toBe(true);
    });

    it('should return false for non-client errors', () => {
      const response500 = new Response(createMockAxiosResponse(500));
      const response200 = new Response(createMockAxiosResponse(200));

      expect(response500.clientError()).toBe(false);
      expect(response200.clientError()).toBe(false);
    });
  });

  describe('data access methods', () => {
    it('should return JSON stringified body', () => {
      const data = { name: 'test', value: 123 };
      const mockAxiosResponse = createMockAxiosResponse(200, data);
      const response = new Response(mockAxiosResponse);

      expect(response.body()).toBe(JSON.stringify(data));
    });

    it('should return JSON data', () => {
      const data = { name: 'test', value: 123 };
      const mockAxiosResponse = createMockAxiosResponse(200, data);
      const response = new Response(mockAxiosResponse);

      expect(response.json()).toEqual(data);
    });

    it('should return specific header', () => {
      const headers = { 'content-type': 'application/json', 'authorization': 'Bearer token' };
      const mockAxiosResponse = createMockAxiosResponse(200, {}, headers);
      const response = new Response(mockAxiosResponse);

      expect(response.header('content-type')).toBe('application/json');
      expect(response.header('authorization')).toBe('Bearer token');
    });

    it('should return all headers', () => {
      const headers = { 'content-type': 'application/json' };
      const mockAxiosResponse = createMockAxiosResponse(200, {}, headers);
      const response = new Response(mockAxiosResponse);

      expect(response.headers()).toEqual(headers);
    });
  });

  describe('throw method', () => {
    it('should throw RequestException for server error', () => {
      const mockAxiosResponse = createMockAxiosResponse(500);
      const response = new Response(mockAxiosResponse);

      expect(() => response.throw()).toThrow(RequestException);
    });

    it('should throw RequestException for client error', () => {
      const mockAxiosResponse = createMockAxiosResponse(404);
      const response = new Response(mockAxiosResponse);

      expect(() => response.throw()).toThrow(RequestException);
    });

    it('should not throw for successful response', () => {
      const mockAxiosResponse = createMockAxiosResponse(200);
      const response = new Response(mockAxiosResponse);

      expect(() => response.throw()).not.toThrow();
      expect(response.throw()).toBe(response);
    });
  });
}); 