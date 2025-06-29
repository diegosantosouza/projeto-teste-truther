import { UserUpdateUseCase } from '@/modules/user/usecases/user-update-usecase';
import { MockUserRepository } from '../__mocks__/user-repository.mock';
import { MockPasswordService } from '../__mocks__/password-service.mock';
import { UserFactory } from '../__mocks__/user-factory';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { UserRole } from '@/modules/user/entities/user';

describe('UserUpdateUseCase', () => {
  let useCase: UserUpdateUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new UserUpdateUseCase(mockRepository as any);
    mockRepository.clearMockData();
  });

  it('should update user name successfully', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011', name: 'John Doe' });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({
      id: '507f1f77bcf86cd799439011',
      name: 'John Updated'
    });

    expect(result.name).toBe('John Updated');
    expect(result.email).toBe('john@example.com');
    expect((result as any).password).toBeUndefined();
  });

  it('should update user password with hash', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011' });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({
      id: '507f1f77bcf86cd799439011',
      password: 'newpassword123'
    });

    expect(result.id).toBe('507f1f77bcf86cd799439011');
    expect((result as any).password).toBeUndefined();
  });

  it('should update user roles', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011', roles: [UserRole.CLIENT] });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({
      id: '507f1f77bcf86cd799439011',
      roles: [UserRole.ADMIN]
    });

    expect(result.roles).toContain(UserRole.ADMIN);
  });

  it('should throw NotFoundError when user not found', async () => {
    mockRepository.setMockData([]);

    await expect(useCase.execute({
      id: '507f1f77bcf86cd799439012',
      name: 'Updated Name'
    })).rejects.toThrow(NotFoundError);
  });

  it('should update multiple fields at once', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011' });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({
      id: '507f1f77bcf86cd799439011',
      name: 'Updated Name',
      email: 'updated@example.com',
      roles: [UserRole.ADMIN]
    });

    expect(result.name).toBe('Updated Name');
    expect(result.email).toBe('updated@example.com');
    expect(result.roles).toContain(UserRole.ADMIN);
  });
}); 