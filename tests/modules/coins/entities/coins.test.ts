import { CoinsNameEnum } from '@/modules/coins/entities';

describe('CoinsNameEnum', () => {
  it('should contain all supported coins', () => {
    const expectedCoins = [
      'bitcoin',
      'ethereum',
      'solana',
      'binancecoin',
      'tether',
      'dogecoin',
      'litecoin'
    ];

    expectedCoins.forEach(coin => {
      expect(Object.values(CoinsNameEnum)).toContain(coin);
    });
  });

  it('should have unique values', () => {
    const values = Object.values(CoinsNameEnum);
    const uniqueValues = new Set(values);

    expect(uniqueValues.size).toBe(values.length);
  });

  it('should have keys in lowercase', () => {
    Object.keys(CoinsNameEnum).forEach(key => {
      expect(key).toMatch(/^[A-Z_]+$/);
    });
  });
}); 