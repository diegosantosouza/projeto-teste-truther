export const env = {
  node_env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  mongo_debug: Boolean(process.env.MONGO_DEBUG ?? false),
  mongo_uri: process.env.MONGO_URI ?? 'mongodb://localhost/truther-api',
  coingecko_base_url: process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3',
  coingecko_api_key: process.env.COINGECKO_API_KEY,
};
