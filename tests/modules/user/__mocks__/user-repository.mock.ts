import { User } from '@/modules/user/entities';
import { UserRole } from '@/modules/user/entities/user';

export class MockUserRepository {
  private users: User[] = [];

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findOne(criteria: Partial<User>): Promise<User | null> {
    const user = this.users.find(user =>
      (Object.keys(criteria) as (keyof User)[]).every(key => user[key] === criteria[key])
    );
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async find(criteria: Partial<User>): Promise<User[]> {
    let users = this.users;
    if (criteria.name && typeof criteria.name === 'string') {
      users = users.filter(u => u.name.toLowerCase().includes(criteria.name!.toLowerCase()));
    }
    if (criteria.email && typeof criteria.email === 'string') {
      users = users.filter(u => u.email.toLowerCase().includes(criteria.email!.toLowerCase()));
    }
    if (criteria.roles) {
      if (typeof criteria.roles === 'object' && criteria.roles !== null && '$in' in criteria.roles) {
        const rolesIn = (criteria.roles as any)['$in'];
        users = users.filter(u => u.roles.some(r => rolesIn.includes(r)));
      } else if (Array.isArray(criteria.roles)) {
        users = users.filter(u => criteria.roles!.some(r => u.roles.includes(r as UserRole)));
      } else {
        users = users.filter(u => u.roles.includes(criteria.roles as unknown as UserRole));
      }
    }
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() };
    const { password, ...userWithoutPassword } = this.users[index];
    return userWithoutPassword as User;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  setMockData(users: User[]): void {
    this.users = [...users];
  }

  clearMockData(): void {
    this.users = [];
  }
}
