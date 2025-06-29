import { UserListUseCase } from '@/modules/user/usecases/user-list-usecase';
import { MockUserRepository } from '../__mocks__/user-repository.mock';
import { UserFactory } from '../__mocks__/user-factory';
import { UserRole } from '@/modules/user/entities/user';

describe('UserListUseCase', () => {
  let useCase: UserListUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new UserListUseCase(mockRepository as any);
    mockRepository.clearMockData();
  });

  it('should return empty array when no users exist', async () => {
    mockRepository.setMockData([]);

    const result = await useCase.execute({});

    expect(result).toEqual([]);
  });

  it('should return all users when no filters applied', async () => {
    const mockUsers = UserFactory.createUserList(3);
    mockRepository.setMockData(mockUsers);

    const result = await useCase.execute({});

    expect(result).toHaveLength(3);
    result.forEach(user => {
      expect((user as any).password).toBeUndefined();
    });
  });

  it('should filter users by name', async () => {
    const user1 = UserFactory.createUser({ id: '1', name: 'John Doe' });
    const user2 = UserFactory.createUser({ id: '2', name: 'Jane Smith', email: 'john@example.com' });
    mockRepository.setMockData([user1, user2]);

    const result = await useCase.execute({ name: 'John' });

    expect(result.some(u => u.name === 'John Doe')).toBe(true);
  });

  it('should filter users by email', async () => {
    const user1 = UserFactory.createUser({ id: '1', email: 'john@example.com', name: 'John Doe' });
    const user2 = UserFactory.createUser({ id: '2', email: 'jane@example.com', name: 'John Doe' });
    mockRepository.setMockData([user1, user2]);

    const result = await useCase.execute({ email: 'john@example.com' });

    expect(result.some(u => u.email === 'john@example.com')).toBe(true);
  });

  it('should filter users by role', async () => {
    const admin = UserFactory.createUser({ roles: [UserRole.ADMIN] });
    const client = UserFactory.createUser({ id: '2', roles: [UserRole.CLIENT] });
    mockRepository.setMockData([admin, client]);

    const result = await useCase.execute({ roles: UserRole.ADMIN });

    expect(result.some(u => u.roles.includes(UserRole.ADMIN))).toBe(true);
  });

  it('should return users without password field', async () => {
    const mockUsers = UserFactory.createUserList(2);
    mockRepository.setMockData(mockUsers);

    const result = await useCase.execute({});

    expect(result).toHaveLength(2);
    result.forEach(user => {
      expect((user as any).password).toBeUndefined();
    });
  });
}); 