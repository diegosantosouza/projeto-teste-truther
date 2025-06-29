import { RequestException } from '../../../src/shared/http/request-exception';
import { ResponseInterface } from '../../../src/shared/http/response-interface';

describe('RequestException', () => {
  it('should create exception with correct message and response', () => {
    const mockResponse: ResponseInterface = {
      status: () => 404,
      json: () => ({ error: 'Not found' }),
      body: () => '{"error":"Not found"}',
      ok: () => false,
      successful: () => false,
      failed: () => true,
      serverError: () => false,
      clientError: () => true,
      header: () => '',
      headers: () => ({}),
      throw: function () { return this; },
    };

    const exception = new RequestException(mockResponse);

    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(RequestException);
    expect(exception.message).toBe('HTTP request returned status code 404.');
    expect(exception.response).toBe(mockResponse);
  });

  it('should create exception with different status code', () => {
    const mockResponse: ResponseInterface = {
      status: () => 500,
      json: () => ({ error: 'Internal server error' }),
      body: () => '{"error":"Internal server error"}',
      ok: () => false,
      successful: () => false,
      failed: () => true,
      serverError: () => true,
      clientError: () => false,
      header: () => '',
      headers: () => ({}),
      throw: function () { return this; },
    };

    const exception = new RequestException(mockResponse);

    expect(exception.message).toBe('HTTP request returned status code 500.');
    expect(exception.response).toBe(mockResponse);
  });
}); 