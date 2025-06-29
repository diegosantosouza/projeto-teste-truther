import { HttpMethodEnum } from '../../../src/shared/http/http-method-enum';

describe('HttpMethodEnum', () => {
  it('should have correct values', () => {
    expect(HttpMethodEnum.GET).toBe('get');
    expect(HttpMethodEnum.POST).toBe('post');
    expect(HttpMethodEnum.PUT).toBe('put');
    expect(HttpMethodEnum.PATCH).toBe('patch');
    expect(HttpMethodEnum.DELETE).toBe('delete');
  });

  it('should have all required HTTP methods', () => {
    const methods = Object.values(HttpMethodEnum);
    expect(methods).toContain('get');
    expect(methods).toContain('post');
    expect(methods).toContain('put');
    expect(methods).toContain('patch');
    expect(methods).toContain('delete');
    expect(methods).toHaveLength(5);
  });
}); 