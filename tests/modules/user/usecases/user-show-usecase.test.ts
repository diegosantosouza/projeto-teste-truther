import { UserShowUseCase } from '@/modules/user/usecases/user-show-usecase';
import { MockUserRepository } from '../__mocks__/user-repository.mock';
import { UserFactory } from '../__mocks__/user-factory';
import { NotFoundError } from '@/shared/errors/not-found-error';

describe('UserShowUseCase', () => {
  let useCase: UserShowUseCase;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    useCase = new UserShowUseCase(mockRepository as any);
    mockRepository.clearMockData();
  });

  it('should return user when found by id', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011', name: 'John Doe' });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({ id: '507f1f77bcf86cd799439011' });

    expect(result.id).toBe('507f1f77bcf86cd799439011');
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
    expect((result as any).password).toBeUndefined();
  });

  it('should throw NotFoundError when user not found', async () => {
    mockRepository.setMockData([]);

    await expect(useCase.execute({ id: '507f1f77bcf86cd799439012' })).rejects.toThrow(NotFoundError);
  });

  it('should return user without password field', async () => {
    const mockUser = UserFactory.createUser({ id: '507f1f77bcf86cd799439011' });
    mockRepository.setMockData([mockUser]);

    const result = await useCase.execute({ id: '507f1f77bcf86cd799439011' });

    expect(result.id).toBe('507f1f77bcf86cd799439011');
    expect((result as any).password).toBeUndefined();
  });
}); 