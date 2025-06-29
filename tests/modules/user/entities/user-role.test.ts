import { UserRole } from '@/modules/user/entities/user';

describe('UserRole', () => {
  it('should contain ADMIN and CLIENT roles', () => {
    expect(UserRole.ADMIN).toBe('admin');
    expect(UserRole.CLIENT).toBe('client');
  });

  it('should have unique values', () => {
    const values = Object.values(UserRole);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
}); 