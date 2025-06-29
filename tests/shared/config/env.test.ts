import { env } from '../../../src/shared/config/env';

describe('env config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should read environment variables correctly', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '8080';
    process.env.MONGO_DEBUG = 'true';
    process.env.MONGO_URI = 'mongodb://test';
    process.env.COINGECKO_BASE_URL = 'https://custom.coingecko.com';
    process.env.COINGECKO_API_KEY = 'apikey';
    jest.resetModules();
    const { env: freshEnv } = require('../../../src/shared/config/env');
    expect(freshEnv.node_env).toBe('production');
    expect(freshEnv.port).toBe(8080);
    expect(freshEnv.mongo_debug).toBe(true);
    expect(freshEnv.mongo_uri).toBe('mongodb://test');
    expect(freshEnv.coingecko_base_url).toBe('https://custom.coingecko.com');
    expect(freshEnv.coingecko_api_key).toBe('apikey');
  });

  it('should use default values when env vars are not set', () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.MONGO_DEBUG;
    delete process.env.MONGO_URI;
    delete process.env.COINGECKO_BASE_URL;
    delete process.env.COINGECKO_API_KEY;
    jest.resetModules();
    const { env: freshEnv } = require('../../../src/shared/config/env');
    expect(freshEnv.node_env).toBe('development');
    expect(freshEnv.port).toBe(3000);
    expect(freshEnv.mongo_debug).toBe(false);
    expect(freshEnv.mongo_uri).toBe('mongodb://localhost/truther-api');
    expect(freshEnv.coingecko_base_url).toBe('https://api.coingecko.com/api/v3');
    expect(freshEnv.coingecko_api_key).toBeUndefined();
  });

  it('should convert port to number and mongo_debug to boolean', () => {
    process.env.PORT = '1234';
    process.env.MONGO_DEBUG = '1';
    jest.resetModules();
    const { env: freshEnv } = require('../../../src/shared/config/env');
    expect(freshEnv.port).toBe(1234);
    expect(freshEnv.mongo_debug).toBe(true);
  });
}); 