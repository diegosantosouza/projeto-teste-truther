import { User } from '@/modules/user/entities';
import { UserRole } from '@/modules/user/entities/user';

export class UserFactory {
  static createUser(overrides: Partial<User> = {}): User {
    const defaultUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      roles: [UserRole.CLIENT],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    };
    return { ...defaultUser, ...overrides };
  }

  static createUserList(count: number = 3): User[] {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push(this.createUser({
        id: (i + 1).toString(),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`
      }));
    }
    return users;
  }

  static createAdmin(): User {
    return this.createUser({
      roles: [UserRole.ADMIN],
      name: 'Admin',
      email: 'admin@example.com'
    });
  }
} 