import { removeUserPassword } from '../../../src/shared/helpers/remove-user-password';

describe('removeUserPassword', () => {
  it('should remove password property from user', () => {
    const user = {
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      password: 'secret',
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = removeUserPassword(user as any);
    expect(result).not.toHaveProperty('password');
    expect(result).toMatchObject({
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      roles: ['user'],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });
}); 